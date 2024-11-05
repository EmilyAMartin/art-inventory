
import React, { useState } from "react";

function TestForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [data, setData] = useState(false);
    const [editData, setEditData] = useState(false);
    console.log(editData);
    console.log(email);
    function handleSubmission() {
        localStorage.clear();
        let userData = {
            Name: name,
            Email: email,
            Number: number,
        };
        localStorage.setItem("userInfo", JSON.stringify(userData));
        document.getElementsByClassName("span").style = "block";
        alert("Data recorded!");
        window.location.reload();
    }

    let userInfo = "";
    function toggleGetData() {
        setData(true);
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(userInfo.Email);
        setName(userInfo.Name);
        setEmail(userInfo.Email);
        setNumber(userInfo.Number);
    }

    function toggleEditData() {
        setEditData(true);
        console.log(editData);
    }
    return (
        <div className="background">
            <div className="box">
                <div className="left-box">
                    <h3>Store data</h3>
                    <label htmlFor="name"> Name </label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Type your name"
                        onChange={(e) => setName(e.target.value)}
                        value={editData ? name : ''}
                    />
                    <label htmlFor="email"> Email </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Type your email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={editData ? email : ''}
                    />
                    <label htmlFor="number"> Number </label>
                    <input
                        type="number"
                        name="num"
                        placeholder="Type your number"
                        onChange={(e) => setNumber(e.target.value)}
                        value={editData ? number : ''}
                    />
                    <button onClick={handleSubmission}>Store my data</button>
                </div>
                <div className="right-box" style={{ textAlign: "center" }}>
                    <button style={{ marginRight: "5px" }} onClick={toggleGetData}>
                        Get Data
                    </button>
                    <button onClick={toggleEditData}>Edit Data</button>
                    {data && (
                        <>
                            <div className="data">
                                <div> Name - {name}</div>
                                <div> Email - {email}</div>
                                <div> Number - {number}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TestForm;
