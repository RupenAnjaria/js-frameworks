declare function require(name:string);
var Perf = require('react-addons-perf');

import { tickerDataModel } from '../models/TickerDataModel';
import { controlPanelModel} from '../models/ControlPanelModel';

class ActionSimulator {
  clearAddTickerTimerId: number;
  clearUpdateTickerTimerId: number;
  tickerDataFromServer;
  newTickerIndexToAdd: number;

  perfTracking: boolean;
  currentAddTickerInterval: number;
  currentUpdateTickerInterval: number;

  constructor() {
    this.tickerDataFromServer = (<any>window).tickerData || []; //for simulation
    this.newTickerIndexToAdd = -1;
  }

  private addTicker() {
    if (this.newTickerIndexToAdd < this.tickerDataFromServer.length - 1) {
      this.newTickerIndexToAdd++;
      var tickerItem = this.tickerDataFromServer[this.newTickerIndexToAdd];
      tickerDataModel.addTicker({
        ticker: <string>tickerItem.Ticker,
        company: <string>tickerItem.Company,
        change: <number>tickerItem.Change || 0,
        sector: <string>tickerItem.Sector,
        industry: <string>tickerItem.Industry,
        last: <number>tickerItem.Price || 0,
        price: <number>tickerItem.Price || 0,
        sma20: <number>tickerItem.SMA20,
        sma50: <number>tickerItem.SMA50,
        sma200: <number>tickerItem.SMA200,
        volume: <number>tickerItem.Volume || 0,
        avgVol: <number>tickerItem.AvgVol
      });

      // UI state changed, reconfigure the timer
      if (this.currentAddTickerInterval !== controlPanelModel.options.addTickerIntervalMSec) {
        this.clearAddTicker();
        this.scheduleAddTicker();
      }
    } else {
      this.stopAddingTickers();
      controlPanelModel.toggleAddTickers(false);
    }
  }

  private upDateTickerData() {
    const randomActionIndex: number = Math.floor(Math.random() * 2) + 1 ; // 1-2
    const randomTickerIndex: number = this.newTickerIndexToAdd > -1 ? Math.floor(Math.random() * (this.newTickerIndexToAdd + 1)) : -1;

    if (randomTickerIndex === -1) { return; }

    var dispatchUpdateAction = ((actionIndex, randomTickerIndex) => {
      const tickerDataItem = (<any>window).tickerData[randomTickerIndex];
      const ticker = (<string>tickerDataItem.Ticker);
      let multiplier = Math.random() > 0.5 ? 1 : -1;
      let changePercent: number = Math.floor(Math.random() * 4); //0 - 3

      switch (actionIndex) {
        case 1:
          const currentPrice: number = tickerDataModel.tickerHash.get(ticker).price;
          const newPrice: number = currentPrice + (multiplier * (currentPrice * changePercent) / 100);
          const newPriceChange: number = newPrice - <number>tickerDataItem.Price;
          tickerDataModel.updatePrice(ticker, newPrice, newPriceChange);
          break;

        case 2:
          const currentVol: number = tickerDataModel.tickerHash.get(ticker).volume;
          const newVol: number = Math.floor(currentVol + (multiplier * (currentVol * changePercent) / 100));
          tickerDataModel.updateVolume(ticker, newVol);
          break;
      }
    })(randomActionIndex, randomTickerIndex);

     // UI state changed, reconfigure the timer
    if (this.currentUpdateTickerInterval !== controlPanelModel.options.updateValueIntervalMSec) {
      this.clearUpdateTicker();
      this.scheduleUpdateTicker();
    }
  }

  private scheduleAddTicker() {
    this.currentAddTickerInterval = controlPanelModel.options.addTickerIntervalMSec || 100;
    this.clearAddTickerTimerId = setInterval(() => this.addTicker(), this.currentAddTickerInterval);
  }

  private clearAddTicker() {
    this.clearAddTickerTimerId && clearInterval(this.clearAddTickerTimerId);
    this.clearAddTickerTimerId = null;
  }

  private scheduleUpdateTicker() {
    this.currentUpdateTickerInterval = controlPanelModel.options.updateValueIntervalMSec || 100;
    this.clearUpdateTickerTimerId = setInterval(() => this.upDateTickerData(), this.currentUpdateTickerInterval);
  }

  private clearUpdateTicker() {
    this.clearUpdateTickerTimerId && clearInterval(this.clearUpdateTickerTimerId);
    this.clearUpdateTickerTimerId = null;
  }

  startAddingTickers() {
    this.scheduleAddTicker();
    this.startPerf();
  }

  stopAddingTickers() {
    this.clearAddTicker();
    this.endPerf();
  }

  startUpdatingTickers() {
    this.scheduleUpdateTicker();
    this.startPerf();
  }

  stopUpdatingTickers() {
    this.clearUpdateTicker();
    this.endPerf();
  }

  startPerf() {
    /*if (!this.perfTracking) {
      Perf.start();
      this.perfTracking = true;
    }*/
  }

  endPerf() {
    /*if (!this.perfTracking) { return; }
    this.perfTracking = false;
    Perf.stop();

    console.log("Inclusive");
    Perf.printInclusive();

    console.log("Exclusive");
    Perf.printExclusive();

    console.log("Wasted");
    Perf.printWasted();*/

    /*console.log("Dom Operations");
    Perf.printOperations(); */
  }
}

export default new ActionSimulator();