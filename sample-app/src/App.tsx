import './App.css'
import  { Command, GenaieInput } from './genaie';
import { setBackgroundColor, setFontSize } from './util';

const commands: Command[] = [{
  name: 'setBackgroundColor',
  description: "Change the page's background to a specified color",
  inputs: [{
    'name': 'color',
    'description': 'The color to use as the background, for example green, red, etc.',
    type: 'string',
    required: true
  }],
  action: (context) => setBackgroundColor(context.inputs.color)
}, {
  name: 'setFontSize',
  description: 'Sets the font size for the text on the page',
  inputs: [{
    name: 'size',
    description: "A descriptive name for the font size, should be one of 'large', 'small' or 'medium'",
    type: 'string',
    required: true
  }],
  action: (context) => setFontSize(context.inputs.size)
}];

function App() {

  return (
    <>
      <div>
        <GenaieInput commands={commands} />
      </div>
    </>
  )
}

export default App
