/**
 * Bot Simulation Engine
 * 
 * Generates realistic betting behavior for risk testing
 */

import {
  BotUser,
  BotSimulationConfig,
  BotBetAction,
  SimulationStats,
  SimulationEvent,
  BOT_BEHAVIORS,
  POPULAR_NUMBERS,
} from '../types/bot-simulation';
import { BetType } from '../config/risk-constants';
import { BetTrackingState, BetRecord } from '../types/bet-tracking';
import { addBetToTracking, canAcceptBet } from './betTrackingService';

/**
 * Generate random number in range
 */
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random float in range
 */
function randomFloatInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Pick random item from array
 */
function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick item based on weighted distribution
 */
function weightedPick<T extends string>(weights: Record<T, number>): T {
  const total = Object.values(weights).reduce((sum: number, w) => sum + (w as number), 0);
  let random = Math.random() * total;
  
  for (const [key, weight] of Object.entries(weights)) {
    random -= (weight as number);
    if (random <= 0) {
      return key as T;
    }
  }
  
  return Object.keys(weights)[0] as T;
}

/**
 * Generate bot user
 */
export function generateBotUser(
  id: number,
  config: BotSimulationConfig
): BotUser {
  const behavior = weightedPick(config.behaviorDistribution);
  const profile = BOT_BEHAVIORS[behavior];
  const hasReferrer = Math.random() < (config.referrerRate / 100);
  
  // Generate favorite bet types (1-3 types)
  const numFavorites = randomInRange(1, 3);
  const allBetTypes: BetType[] = ['TOP3', 'TOAD3', 'TOP2', 'BOTTOM2'];
  const favoriteBetTypes: BetType[] = [];
  
  for (let i = 0; i < numFavorites; i++) {
    const type = weightedPick(config.betTypeDistribution) as BetType;
    if (!favoriteBetTypes.includes(type)) {
      favoriteBetTypes.push(type);
    }
  }
  
  // Generate favorite numbers (2-5 numbers per type)
  const favoriteNumbers: string[] = [];
  favoriteBetTypes.forEach(type => {
    const numFavs = randomInRange(2, 5);
    const popular = POPULAR_NUMBERS[type];
    for (let i = 0; i < numFavs; i++) {
      if (Math.random() < 0.7) {
        // 70% chance to pick popular number
        favoriteNumbers.push(randomPick(popular));
      } else {
        // 30% chance to pick random number
        if (type === 'TOP3' || type === 'TOAD3') {
          favoriteNumbers.push(randomInRange(0, 999).toString().padStart(3, '0'));
        } else {
          favoriteNumbers.push(randomInRange(0, 99).toString().padStart(2, '0'));
        }
      }
    }
  });
  
  return {
    id: `BOT_${id.toString().padStart(4, '0')}`,
    name: `Bot${id}`,
    behavior,
    hasReferrer,
    avgBetAmount: profile.avgBetAmount,
    minBetAmount: profile.minBetAmount,
    maxBetAmount: profile.maxBetAmount,
    favoriteBetTypes,
    favoriteNumbers: [...new Set(favoriteNumbers)],
    betsPerDay: profile.betsPerDay,
  };
}

/**
 * Generate bet action from bot
 */
export function generateBotBet(
  bot: BotUser,
  currentHour: number,
  peakHours: number[]
): BotBetAction {
  // Pick bet type from favorites
  const betType = randomPick(bot.favoriteBetTypes);
  
  // Pick number (80% favorite, 20% random)
  let number: string;
  if (Math.random() < 0.8 && bot.favoriteNumbers.length > 0) {
    number = randomPick(bot.favoriteNumbers);
  } else {
    if (betType === 'TOP3' || betType === 'TOAD3') {
      number = randomInRange(0, 999).toString().padStart(3, '0');
    } else {
      number = randomInRange(0, 99).toString().padStart(2, '0');
    }
  }
  
  // Calculate bet amount with peak hour multiplier
  let amount = randomFloatInRange(bot.minBetAmount, bot.maxBetAmount);
  
  // Peak hours increase bet size by 20-50%
  if (peakHours.includes(currentHour)) {
    amount *= randomFloatInRange(1.2, 1.5);
  }
  
  // Round to nearest 10
  amount = Math.round(amount / 10) * 10;
  amount = Math.max(bot.minBetAmount, Math.min(bot.maxBetAmount, amount));
  
  return {
    botId: bot.id,
    botName: bot.name,
    betType,
    number,
    amount,
    hasReferrer: bot.hasReferrer,
    timestamp: new Date(),
  };
}

/**
 * Bot Simulation Engine Class
 */
export class BotSimulationEngine {
  private config: BotSimulationConfig;
  private bots: BotUser[] = [];
  private trackingState: BetTrackingState;
  private stats: SimulationStats;
  private events: SimulationEvent[] = [];
  private recentBets: BetRecord[] = [];
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: Date = new Date();
  private simulatedTime: Date = new Date();
  private initialCapital: number = 10000000;
  private totalNetSales: number = 0;
  
  constructor(
    config: BotSimulationConfig,
    initialTrackingState: BetTrackingState,
    initialCapital: number = 10000000
  ) {
    this.config = config;
    this.trackingState = initialTrackingState;
    this.initialCapital = initialCapital;
    this.stats = this.initializeStats();
  }
  
  private initializeStats(): SimulationStats {
    return {
      totalBots: 0,
      activeBots: 0,
      totalBets: 0,
      totalVolume: 0,
      totalCommission: 0,
      averageBetSize: 0,
      betsPerMinute: 0,
      currentDailyVolume: 0,
      targetDailyVolume: this.config.dailyTargetVolume,
      progressPercent: 0,
      riskMetrics: {
        numbersAtRisk: 0,
        highestUsagePercent: 0,
        highestUsageNumber: '-',
        rejectedBets: 0,
      },
      startTime: new Date(),
      elapsedTime: 0,
    };
  }
  
  /**
   * Initialize bots
   */
  public initializeBots(): void {
    this.bots = [];
    for (let i = 1; i <= this.config.numberOfBots; i++) {
      const bot = generateBotUser(i, this.config);
      this.bots.push(bot);
    }
    
    this.stats.totalBots = this.bots.length;
    this.addEvent('bot_created', `สร้าง ${this.bots.length} bots สำเร็จ`);
  }
  
  /**
   * Start simulation
   */
  public start(): void {
    if (this.isRunning) return;
    
    if (this.bots.length === 0) {
      this.initializeBots();
    }
    
    this.isRunning = true;
    this.startTime = new Date();
    this.simulatedTime = new Date();
    this.addEvent('simulation_started', 'เริ่มการจำลอง');
    
    // Run simulation tick every second (adjusted by speed multiplier)
    const tickInterval = 1000 / this.config.speedMultiplier;
    
    this.intervalId = setInterval(() => {
      this.tick();
    }, tickInterval);
  }
  
  /**
   * Stop simulation
   */
  public stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.addEvent('simulation_stopped', 'หยุดการจำลอง');
  }
  
  /**
   * Simulation tick (runs every simulated second)
   */
  private tick(): void {
    // Advance simulated time
    this.simulatedTime = new Date(this.simulatedTime.getTime() + 1000);
    
    const currentHour = this.simulatedTime.getHours();
    const currentMinute = this.simulatedTime.getMinutes();
    const currentSecond = this.simulatedTime.getSeconds();
    
    // Calculate how many bots should bet this second
    const totalBetsPerDay = this.bots.reduce((sum, bot) => sum + bot.betsPerDay, 0);
    const betsPerSecond = totalBetsPerDay / (24 * 60 * 60);
    
    // Peak hour multiplier
    const isPeakHour = this.config.peakHours.includes(currentHour);
    const peakMultiplier = isPeakHour ? 1.5 : 1.0;
    
    const expectedBets = betsPerSecond * peakMultiplier;
    
    // Randomly select bots to bet
    const numBets = Math.round(expectedBets + (Math.random() - 0.5));
    
    for (let i = 0; i < numBets; i++) {
      const bot = randomPick(this.bots);
      this.processBotBet(bot, currentHour);
    }
    
    // Update stats every second
    this.updateStats();
    
    // Reset daily volume at midnight
    if (currentHour === 0 && currentMinute === 0 && currentSecond === 0) {
      this.stats.currentDailyVolume = 0;
    }
  }
  
  /**
   * Process a single bot bet
   */
  private processBotBet(bot: BotUser, currentHour: number): void {
    const betAction = generateBotBet(bot, currentHour, this.config.peakHours);
    
    // Check if bet can be accepted
    const canAccept = canAcceptBet(
      this.trackingState,
      betAction.betType,
      betAction.number,
      betAction.amount
    );
    
    if (!canAccept.canAccept) {
      this.stats.riskMetrics.rejectedBets++;
      const betTypeLabel = this.getBetTypeLabel(betAction.betType);
      this.addEvent(
        'bet_rejected', 
        `${betAction.botName} แทง ${betTypeLabel} เลข ${betAction.number} ฿${betAction.amount.toLocaleString()} - ถูกปฏิเสธ: ${canAccept.reason}`,
        {
          botName: betAction.botName,
          betType: betAction.betType,
          number: betAction.number,
          amount: betAction.amount,
          reason: canAccept.reason
        }
      );
      return;
    }
    
    // Create bet record
    const commission = betAction.hasReferrer ? betAction.amount * 0.08 : 0;
    const netAmount = betAction.amount - commission;
    
    const betRecord: BetRecord = {
      id: `BET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: betAction.botId,
      username: betAction.botName,
      betType: betAction.betType,
      number: betAction.number,
      amount: betAction.amount,
      netAmount,
      commission,
      hasReferrer: betAction.hasReferrer,
      timestamp: betAction.timestamp,
      status: 'accepted',
      payoutRate: 0, // Will be determined by risk system
    };
    
    // Add to tracking state
    this.trackingState = addBetToTracking(this.trackingState, betRecord);
    
    // Add to recent bets (keep last 100)
    this.recentBets.push(betRecord);
    if (this.recentBets.length > 100) {
      this.recentBets.shift();
    }
    
    // Update total net sales (เงินทุนเพิ่มขึ้นตามยอดขายสุทธิ)
    this.totalNetSales += netAmount;
    
    // Update stats
    this.stats.totalBets++;
    this.stats.totalVolume += betAction.amount;
    this.stats.totalCommission += commission;
    this.stats.currentDailyVolume += netAmount;
    
    // Add detailed bet event
    const betTypeLabel = this.getBetTypeLabel(betAction.betType);
    this.addEvent(
      'bet_placed', 
      `${betAction.botName} แทง ${betTypeLabel} เลข ${betAction.number} ฿${betAction.amount.toLocaleString()}`,
      { 
        botName: betAction.botName, 
        betType: betAction.betType, 
        number: betAction.number, 
        amount: betAction.amount,
        netAmount: netAmount,
        commission: commission
      }
    );
    
    // Check if limit reached
    if (canAccept.newUsage > 85) {
      this.addEvent('limit_reached', `${betAction.number} ใกล้ลิมิต (${canAccept.newUsage.toFixed(1)}%)`);
    }
  }
  
  /**
   * Get bet type label in Thai
   */
  private getBetTypeLabel(betType: BetType): string {
    switch (betType) {
      case 'TOP3': return '3ตัวบน';
      case 'TOAD3': return '3ตัวโต๊ด';
      case 'TOP2': return '2ตัวบน';
      case 'BOTTOM2': return '2ตัวล่าง';
      default: return betType;
    }
  }
  
  /**
   * Update statistics
   */
  private updateStats(): void {
    const now = new Date();
    this.stats.elapsedTime = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
    
    if (this.stats.totalBets > 0) {
      this.stats.averageBetSize = this.stats.totalVolume / this.stats.totalBets;
    }
    
    // Calculate bets per minute
    const elapsedMinutes = this.stats.elapsedTime / 60;
    if (elapsedMinutes > 0) {
      this.stats.betsPerMinute = this.stats.totalBets / elapsedMinutes;
    }
    
    // Calculate progress
    this.stats.progressPercent = (this.stats.currentDailyVolume / this.stats.targetDailyVolume) * 100;
    
    // Update risk metrics
    let highestUsage = 0;
    let highestNumber = '-';
    let numbersAtRisk = 0;
    
    Object.values(this.trackingState.tables).forEach(table => {
      table.numbers.forEach(summary => {
        if (summary.usagePercent > highestUsage) {
          highestUsage = summary.usagePercent;
          highestNumber = summary.number;
        }
        if (summary.usagePercent > 70) {
          numbersAtRisk++;
        }
      });
    });
    
    this.stats.riskMetrics.highestUsagePercent = highestUsage;
    this.stats.riskMetrics.highestUsageNumber = highestNumber;
    this.stats.riskMetrics.numbersAtRisk = numbersAtRisk;
  }
  
  /**
   * Add event to log
   */
  private addEvent(type: SimulationEvent['type'], message: string, data?: any): void {
    const event: SimulationEvent = {
      type,
      timestamp: new Date(),
      data: data || {},
      message,
    };
    
    this.events.push(event);
    
    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events.shift();
    }
  }
  
  /**
   * Get current stats
   */
  public getStats(): SimulationStats {
    return { ...this.stats };
  }
  
  /**
   * Get recent events
   */
  public getEvents(limit: number = 20): SimulationEvent[] {
    return this.events.slice(-limit);
  }
  
  /**
   * Get tracking state
   */
  public getTrackingState(): BetTrackingState {
    return this.trackingState;
  }
  
  /**
   * Get bots
   */
  public getBots(): BotUser[] {
    return [...this.bots];
  }
  
  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<BotSimulationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.stats.targetDailyVolume = this.config.dailyTargetVolume;
  }
  
  /**
   * Get recent bets
   */
  public getRecentBets(limit: number = 50): BetRecord[] {
    return this.recentBets.slice(-limit);
  }
  
  /**
   * Reset simulation
   */
  public reset(newTrackingState: BetTrackingState): void {
    this.stop();
    this.trackingState = newTrackingState;
    this.stats = this.initializeStats();
    this.events = [];
    this.recentBets = [];
    this.bots = [];
  }
  
  /**
   * Get simulated time
   */
  public getSimulatedTime(): Date {
    return new Date(this.simulatedTime);
  }
  
  /**
   * Is running
   */
  public getIsRunning(): boolean {
    return this.isRunning;
  }
  
  /**
   * Get current dynamic capital (เงินทุนเริ่มต้น + ยอดขายสุทธิสะสม)
   */
  public getCurrentCapital(): number {
    return this.initialCapital + this.totalNetSales;
  }
  
  /**
   * Get initial capital
   */
  public getInitialCapital(): number {
    return this.initialCapital;
  }
  
  /**
   * Get total net sales
   */
  public getTotalNetSales(): number {
    return this.totalNetSales;
  }
  
  /**
   * Update initial capital
   */
  public updateInitialCapital(newCapital: number): void {
    this.initialCapital = newCapital;
  }
}
