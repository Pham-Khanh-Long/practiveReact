import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../services/UserService';
import { toast } from 'react-toastify';
const ModalComfirm = (props) => {
  const {show, handleClose, dataUserDelete, handleDeleteUserFromModal} = props;
  const ComfirmDelete =  async () =>{
    let res = await deleteUser(dataUserDelete.id)
    if(res && +res.statusCode === 204)
    {
      toast.success("Delete Use Success")
      handleDeleteUserFromModal(dataUserDelete)
      handleClose();
    }
    else{
      toast.error("Delete user fail")
    }
    console.log("check res: ", res)
  }
  return (<>
      <Modal 
      show={show} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete a user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='add-new-user'>
            <div>
                This action can't be undone!
                Do you want delete this user, email: {dataUserDelete.email}?
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => ComfirmDelete()}>
            ComfirmDelete
          </Button>
        </Modal.Footer>
      </Modal>
  </>)
}

export default ModalComfirm;