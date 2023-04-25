import React from 'react';
import ChordDiagram from './ChordDiagram'
import NetworkGraph from './NetworkGraph'


class App extends React.Component {
    render() {
      return (
        <div>
          <ChordDiagram />
          <NetworkGraph/>
        </div>
      );
    }
  }

  export default App;