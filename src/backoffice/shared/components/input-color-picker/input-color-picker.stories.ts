import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';

import type { UmbInputColorPickerElement } from './input-color-picker.element';
import './input-color-picker.element';

export default {
	title: 'Components/Color Picker',
	component: 'umb-input-color-picker',
	id: 'umb-input-color-picker',
} as Meta;


const Template: Story<UmbInputColorPickerElement> = (args) => 
    html`<umb-input-color-picker .swatches=${args.swatches} .showLabels=${args.showLabels} .value=${args.value}></umb-input-color-picker>`;
  
  export const Overview = Template.bind({});
  Overview.args = {
    showLabels: true,
    swatches: [
        {
            label: "Red",
            value: "#ff0000"
        },
        {
            label: "Green",
            value: "#00ff00"
        }
    ]
  };
  
  export const WithoutLabels = Template.bind({});
  WithoutLabels.args = {
    showLabels: false,
    swatches: [
        {
            label: "Red",
            value: "#ff0000"
        },
        {
            label: "Green",
            value: "#00ff00"
        }
    ]
  };

  // TODO: This doesn't check the correct swatch when the value is set
  export const WithValueSet = Template.bind({});
  WithValueSet.args = {
    showLabels: true,
    swatches: [
        {
            label: "Red",
            value: "#ff0000"
        },
        {
            label: "Green",
            value: "#00ff00"
        }
    ],
    value: "#00ff00"
  };