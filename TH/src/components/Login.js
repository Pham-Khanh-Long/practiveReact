const Login = () =>{
    return (<>
        <div className="login-container col-4">
            <div className="title">Login</div>
            <div className="text">Email or Username</div>
            <input className="inp-email" type="text" placeholder="Email or Username...." />
            <input className="inp-pw" tyoe="text" placeholder="Password...."/>
            <button>Login</button>
            <div className="back">
            <i className="fa-solid fa-chevron-left"></i> Go back
            </div>
        </div>
    </>)
}
export default Login