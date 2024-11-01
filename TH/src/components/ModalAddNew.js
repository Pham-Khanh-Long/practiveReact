import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postCreateUser } from '../services/UserService';
import { toast } from 'react-toastify';
const ModalAddNew = (props) => {
  const {show, handleClose, handleUpdateTable} = props;
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  
  const handlesaveuser = async () => {
    // console.log("check: ", "name = ", name, "job = ", job)
    let res = await postCreateUser(name, job);
        console.log("check res: ", res)
        if(res && res.id){
          handleClose();
          setName("");
          setJob("");
          toast.success("Thêm thành công");
          handleUpdateTable({first_name: name, id: res.id})
        }
        else{
          toast.error("Thêm thất bại")
        }
  }
  return (<>
      <Modal 
      // Bấm ra ngoài không đóng modal
      show={show} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='add-new-user'>
            <div>
              <form>
                <div className="mb-3">
                  <label className='form-label'>Name</label>
                  <input type="text" className="form-control" 
                  value={name} 
                  onChange={(event) => setName(event.target.value)}/>
                </div>
                <div className="mb-3">
                  <label className='form-label'>Job</label>
                  <input type="text" className="form-control" 
                  value={job} 
                  onChange={(event) => setJob(event.target.value)}/>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handlesaveuser()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  </>)
}

export default ModalAddNew;