import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import dayjs from "dayjs";


const Userlist = () => {
    // eslint-disable-next-line
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();
    const getUsersData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get("/api/admin/get-all-users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setUsers(response.data.data)
            }
        }
        catch (error) {
            dispatch(hideLoading())
        }
    }

    useEffect(() => {
        getUsersData()
        // eslint-disable-next-line
    }, [])

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (record, text) => dayjs(record.createdAt).format("DD-MM-YYYY")
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    <h1 className="anchor">Block</h1>
                </div>
        )}
    ]

    return (
        <Layout>
            <h2 className="page-header">Users</h2>
            <Table columns={columns} dataSource={users}/>
        </Layout>
    )
}

export default Userlist;