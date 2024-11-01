import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { putUpdateUser } from '../services/UserService';
import { toast } from 'react-toastify';
const ModalEditUser = (props) => {
  const {show, handleClose, dataUserEdit, handleEditUserFromModal} = props;
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  
  // const handleEditUser = async () => {
  //   const res = await putUpdateUser(name, job);
  //   console.log("check: ", res);
  // };

  const handleEditUser = async () => {
    try {
      const res = await putUpdateUser(dataUserEdit.id, name, last_name); // Thêm ID nếu cần
      console.log(res)
      if (res && res.updatedAt){
        handleEditUserFromModal({
          first_name:name,
          last_name: last_name,
          id: dataUserEdit.id
        })
        handleClose();
        toast.success("Update success")
      }
      // console.log('Cập nhật thành công:', res);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error.response ? error.response.data : error.message);
    }
  };
  useEffect (() =>{
    if(show){
      setName(dataUserEdit.first_name)
      setLastName(dataUserEdit.last_name)
    }
  }, [dataUserEdit, show])
  // console.log("check: ", dataUserEdit)
  return (<>
      <Modal 
      show={show} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
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
                  <label className='form-label'>Last Name</label>
                  <input type="text" className="form-control" 
                  value={last_name} 
                  onChange={(event) => setLastName(event.target.value)}/>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleEditUser()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  </>)
}

export default ModalEditUser;