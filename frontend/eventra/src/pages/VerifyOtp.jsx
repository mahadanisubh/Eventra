import { useState } from "react"
import { useLocation,useNavigate } from "react-router-dom"
import BASE_URL from "../../api";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;

    const handleVerify = async () => {
        try{
        const res = await fetch(`${BASE_URL}/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userId, otp})
    });
        const data = await res.json();
        if(!res.ok){
            alert(data.message);
            return;
        }
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login Successful")

        navigate("/");
    }
    catch(err){
        console.log(err);
    }
}
    
    return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
}

export default VerifyOtp;