import Table from 'react-bootstrap/Table';
import {useEffect, useState} from 'react';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModelAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import ModalComfirm from './ModalComfirm';
import './TableUsers.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
import _, { debounce } from "lodash";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; //
import { toast } from 'react-toastify';

const TableUsers = (props) =>{
    const [listUsers, setListUsers] = useState([]);
    const [totalUser, setTotalUsers] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    // const { ExcelDownloder, Type } = useExcelDownloder();

    const handleEditUserFromModal = (user) =>{
      let cloneListUser = _.cloneDeep(listUsers)
      let index = listUsers.findIndex(item => item.id === user.id);
      cloneListUser[index].first_name = user.first_name;
      cloneListUser[index].last_name = user.last_name;
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
    // Sort User
    const [sortBy, setSortBy] = useState("asc")
    const [sortField, setSortField] = useState("id")

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
    const handleSort = (sortBy, sortField) =>{
      setSortBy(sortBy);
      setSortField(sortField);
      let cloneListUser = _.cloneDeep(listUsers)
      cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]) 
      // console.log(cloneListUser)
      setListUsers(cloneListUser)
    }
    // console.log("Check sort: ", sortBy, sortField)
    const handleSearch = debounce((event) =>{
      let term = event.target.value;
      console.log(term)
      if(term){
        let cloneListUser = _.cloneDeep(listUsers)
        cloneListUser = cloneListUser.filter(item => item.email.includes(term))
        setListUsers(cloneListUser)
      }
      else{
        getUser(1);
      }
    }, 500)

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
    useEffect(() => {
      getUser(1);
    },[])
    const handleExportToExcel = () => {
      if (listUsers && listUsers.length > 0) {
        // Tạo dữ liệu export với tiêu đề cột
        const data = [
          ["ID", "Email", "First name", "Last name"],
          ...listUsers.map(item => [item.id, item.email, item.first_name, item.last_name])
        ];
  
        // Tạo một worksheet từ dữ liệu
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  
        // Ghi file xlsx
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "User.xlsx"); // Lưu file với tên User.xlsx
      }
    }
    const handleImporXLSX = (event) =>{
        let file = event.target.files[0];
        console.log(file)
        if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
          toast.error("Only accept xlsx files....")
          return;
        }
        else{
          
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Chuyển đổi dữ liệu từ Excel sang định dạng mong muốn
          const importedData = jsonData.slice(1).map(row => ({
            id: row[0],
            email: row[1],
            first_name: row[2],
            last_name: row[3]
          }));

          // Cập nhật danh sách người dùng với dữ liệu mới
          setListUsers(importedData);
          console.log(importedData)
        };

        reader.readAsArrayBuffer(file);
    }
    return (<>
        <div className='my-3 add-new'>
          <span>
            <b>List User:</b>
          </span>
          <div className='group-btn'>
              <label className='btn btn-warning' htmlFor='test'>  
                <i className="fa-sharp fa-solid fa-file-import"></i> Import
              </label>
              <input id='test' type='file' hidden
              onChange={(event) => handleImporXLSX(event)} />
              <button className='btn btn-primary' onClick={handleExportToExcel}>
                <i className="fa-solid fa-file-export"></i> Export
              </button>
              <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}> 
                <i className="fa-solid fa-circle-plus"></i> Add New
              </button>
          </div>
        </div>
      <div className='col-4 my-3'>
        <input className='form-control' placeholder='Search user by email....' 
        onChange={(event) => handleSearch(event)}></input>
      </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <div className='sort-header'>
                    <span>ID</span>
                    <span>
                        <i className="fa-sharp-duotone fa-solid fa-arrow-down" 
                        onClick={() => handleSort("desc", "id")}></i>
                        <i className="fa-sharp-duotone fa-solid fa-arrow-up"
                         onClick={() => handleSort("asc", "id")}></i>
                    </span>
                </div>
              </th>
              <th>Email</th>
              <th>
                <div className='sort-header'>
                    <span>First Name</span>
                    <span>
                        <i className="fa-sharp-duotone fa-solid fa-arrow-down" 
                        onClick={() => handleSort("desc", "first_name")}></i>
                        <i className="fa-sharp-duotone fa-solid fa-arrow-up"
                         onClick={() => handleSort("asc", "first_name")}></i>
                    </span>
                </div>
              </th>
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