import React from 'react';

import { db } from './firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
interface AppProps {}

class App extends React.Component {
  constructor(props: AppProps) {
    super(props);
    this.state = { selectedNoteIndex: null, selectedNote: null, notes: null };
  }

  public async getData() {
    const querySnapshot = await getDocs(collection(db, 'notes'));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      this.setState({ notes: data });
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return <div>test</div>;
  }
}

export default App;
