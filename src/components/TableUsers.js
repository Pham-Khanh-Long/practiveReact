import Table from 'react-bootstrap/Table';
import {useEffect, useState} from 'react';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModelAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import ModalComfirm from './ModalComfirm';
import _ from "lodash";
const TableUsers = (props) =>{
    const [listUsers, setListUsers] = useState([]);
    const [totalUser, setTotalUsers] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const handleEditUserFromModal = (user) =>{
      let cloneListUser = _.cloneDeep(listUsers)
      let index = listUsers.findIndex(item => item.id === user.id);
      cloneListUser[index].first_name = user.first_name;
      // console.log(listUsers, cloneListUser);
      // console.log('Index: ', index);
      setListUsers(cloneListUser)
    }
    const handleDeleteUserFromModal = (user) =>{
      let cloneListUser = _.cloneDeep(listUsers)
      cloneListUser = cloneListUser.filter(item => item.id !== user.id)
      // console.log(listUsers, cloneListUser);
      // console.log('Index: ', index);
      setListUsers(cloneListUser)
    }
    //Add User:
    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
    // Edit User:
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [dataUserEdit, setDataUserEdit] = useState([])
    // Delete User
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState([])

    const handleClose = () =>{
      setIsShowModalAddNew(false);
      setIsShowModalEdit(false);
      setIsShowModalDelete(false);
    }
    const handleEditUser = (user) =>{
      setDataUserEdit(user);
      setIsShowModalEdit(true);
    }
    const handleUpdateTable = (user) => {
      setListUsers ([user, ...listUsers])
    }

    const handleComfirm = (user) =>{
      setIsShowModalDelete(true)
      setDataUserDelete(user)
      // console.log(user)
    }
    useEffect(() => {
        getUser(1);
    },[])
    const getUser = async(page) => {
        let res = await fetchAllUser(page);
        if(res && res.data){
            // console.log(res)
            setTotalUsers(res.total)
            setListUsers(res.data)
            setTotalPage(res.total_pages)
        }
    }
    // console.log(listUsers)
    const handlePageClick = (event) =>{
        getUser(+event.selected +1)
    }
    return (<>
        <div className='my-3 add-new'>
          <span>
            <b>List User:</b>
          </span>
          <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}> Add New Users</button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
                listUsers && listUsers.length > 0 &&
                listUsers.map((item, index) => {
                    return(
                        <tr key = {`users-${index}`}>
                        <td>{item.id}</td>
                        <td>{item.email}</td>
                        <td>{item.first_name}</td>
                        <td>{item.last_name}</td>
                        <td>
                          <button className='btn btn-warning mx-3' 
                            onClick={() => handleEditUser(item)}>
                            Edit</button>
                          <button className='btn btn-danger mx-3'   
                            onClick = {() => handleComfirm(item)}>
                            Delete</button>
                        </td>
                      </tr>
                    )
                })
            }
          </tbody>
        </Table>
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPage}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"  
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
        />
        <ModelAddNew
        show = {isShowModalAddNew}
        handleClose = {handleClose}
        handleUpdateTable = {handleUpdateTable}
        />
        <ModalEditUser
        show = {isShowModalEdit}
        dataUserEdit = {dataUserEdit}
        handleClose = {handleClose}
        handleEditUserFromModal = {handleEditUserFromModal}
        />
        <ModalComfirm
        show = {isShowModalDelete}
        handleClose = {handleClose}
        dataUserDelete = {dataUserDelete}
        handleDeleteUserFromModal = {handleDeleteUserFromModal}
        />
      </>);
}
export default TableUsers