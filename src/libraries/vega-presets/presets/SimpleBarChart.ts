import * as preset from '../preset'

export interface IPresetOptions extends preset.IPresetOptions {
  x: string
  y: string
}

export default class Preset extends preset.Preset<IPresetOptions> {
  static type = 'simple-bar-chart'
  static group = 'bar'
  static title = 'Simple Bar Chart'
  static image = 'https://github.com/vega/vega-lite/raw/main/examples/compiled/bar.png'
  static source = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    mark: 'bar',
    encoding: {
      x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
      y: { field: 'b', type: 'quantitative' },
    },
  }

  static target = {
    options: [
      {
        name: 'x',
        type: 'string',
        label: 'Field X',
        paths: ['$.encoding.x.field'],
      },
      {
        name: 'y',
        type: 'number',
        label: 'Field Y',
        paths: ['$.encoding.y.field'],
      },
    ],
  }
}
