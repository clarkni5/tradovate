/**
 * Name: Volume Spikes
 *
 * Location: Volume-based -> Volume Spikes
 *
 * Description:
 * A volume histogram that highlights bars when they are above a simple moving
 * average threshold. The threshold is defined at a number of standard
 * deviations from the moving average. For visual reference, bands are plotted
 * at 1, 2, and 3 standard deviations from the moving average.
 *
 * Params:
 * - period: The simple moving average period.
 * - stdDev: The number of standard deviations that define the threshold.
 * - spikeColor: The color used to highlight volume bars.
 *
 * Plots:
 * - Volume: The volume bars.
 * - Threshold: The threshold value.
 * - SMA: The simple moving average.
 * - Band1: 1 standard deviation from the moving average.
 * - Band2: 2 standard deviations from the moving average.
 * - Band3: 3 standard deviations from the moving average.
 */
const predef = require('./tools/predef');
const meta = require('./tools/meta');
const StdDev = require('./tools/StdDev');

class volumeSpikes {
  init() {
    this.stdDev = StdDev(this.props.period);
  }

  map(d) {
    const stdev = this.stdDev(d.volume());
    const sma = this.stdDev.avg();

    const threshold = sma + (stdev * this.props.stdDev);

    // Create bands at 1, 2, and 3 standard deviations.
    const band1 = sma + (stdev * 1);
    const band2 = sma + (stdev * 2);
    const band3 = sma + (stdev * 3);

    return {
      volume: d.volume(),
      threshold: threshold,
      sma: sma,
      band1: band1,
      band2: band2,
      band3: band3,
      style: {
        // Highlight values above the threshold.
        volume: (d.volume() > threshold) && {
          color: this.props.spikeColor
        }
      },
    };
  }
}

module.exports = {
  name: 'volumeSpikes',
  description: 'Volume Spikes',
  tags: [predef.tags.Volumes],
  calculator: volumeSpikes,
  inputType: meta.InputType.BARS,
  params: {
    period: predef.paramSpecs.period(50),
    stdDev: predef.paramSpecs.number(1.5, 0.1, 0.1),
    spikeColor: predef.paramSpecs.color('#F8E71C'),
  },
  plots: {
    volume: { title: 'Volume' },
    threshold: { title: 'Threshold' },
    sma: { title: 'SMA' },
    band1: { title: 'Band1' },
    band2: { title: 'Band2' },
    band3: { title: 'Band3' },
  },
  plotter: [
    {
      type: 'histogram',
      fields: ['volume']
    },
    predef.plotters.singleline('threshold'),
    predef.plotters.multiline(['sma', 'band1', 'band2', 'band3']),
  ],
  areaChoice: meta.AreaChoice.NEW,
  schemeStyles: {
    dark: {
      volume: predef.styles.plot({
        color: '#7E838C',
        lineStyle: 1,
        lineWidth: 1,
        opacity: 100,
      }),
      threshold: predef.styles.plot({
        color: '#50E3C2',
        lineStyle: 1,
        lineWidth: 1,
        opacity: 100,
      }),
      sma: predef.styles.plot({
        color: '#4A4A4A',
        lineStyle: 3,
        lineWidth: 1,
        opacity: 100,
      }),
      band1: predef.styles.plot({
        color: '#8B572A',
        lineStyle: 3,
        lineWidth: 1,
        opacity: 100,
      }),
      band2: predef.styles.plot({
        color: '#F5A623',
        lineStyle: 3,
        lineWidth: 1,
        opacity: 100,
      }),
      band3: predef.styles.plot({
        color: '#D0021B',
        lineStyle: 3,
        lineWidth: 1,
        opacity: 100,
      })
    }
  }
};
