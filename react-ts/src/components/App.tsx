import React from 'react';
import './App.css';

interface AppProps {
  color?: string;
}

interface AppState {
  counter: number;
}

class App extends React.Component<AppProps, AppState> {

  // constructor(props: AppProps) {
  //   super(props);
  //   this.state = {counter: 0}
  // }
  state = {counter: 0}

  onIncrement = ():void => {
    this.setState({counter: this.state.counter + 1})
  }
  onDecrement = ():void => {
    this.setState({counter: this.state.counter - 1})
  }

  render() {
    return (
      <div>
        {this.state.counter}
        <button onClick={this.onIncrement}>Increment</button>
        <button onClick={this.onDecrement}>Decrement</button>
      </div>
    )
  }
}

// const App = (props: AppProps): JSX.Element => {
//   return (<div><div>
//     {props.color}
//     </div></div>)
// }

export default App;
