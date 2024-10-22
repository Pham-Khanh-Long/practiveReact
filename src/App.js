import { Container } from 'react-bootstrap';
import './App.scss';
import Header from './components/Header'
import TableUsers from './components/TableUsers'
import ModelAddNew from './components/ModalAddNew';
import {useState} from 'react';
function App() {
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const handleClose = () =>{
    setIsShowModalAddNew(false);
  }
  return (
    <div className='app-container'>
        <Header />
      <Container>
      <div className='my-3 add-new'>
        <span>
          <b>List User:</b>
        </span>
        <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}> Add New Users</button>
      </div>
        <TableUsers />
      </Container>
      <ModelAddNew
      show = {isShowModalAddNew}
      handleClose = {handleClose}
      />
    </div>
  );
}

export default App;
