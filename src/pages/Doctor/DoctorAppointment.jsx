import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();

    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get("/api/doctor/get-appointments-by-doctor-id", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading())
            if (response.data.success) {
                setAppointments(response.data.data)
            }
        }
        catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    }

    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading())
            const response = await axios.post("/api/doctor/change-appointment-status", { appointmentId: record._id,  status: status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message);
                getAppointmentsData();
            }
        }
        catch (error) {
            toast.error("Error changing Doctor account status");
            dispatch(hideLoading());
        }
    }

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Patient",
            dataIndex: "name",
            render: (text, record) => (
                <span className="normal-text">
                    {record.userInfo.name}
                </span>
            )
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            render: (text, record) => (
                <span className="normal-text">
                    {record.userInfo.phoneNumber}
                </span>
            )
        },
        {
            title: "Date & Time",
            dataIndex: "createdAt",
            render: (text, record) => (
                <span className="normal-text">
                    {dayjs(record.date).format("DD-MM-YYYY")} {dayjs(record.time).format("HH:mm")}
                </span>
            )
        },
        {
            title: "Status",
            dataIndex: "status"
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === "pending" && (
                        <div className="d-flex">
                        <h1 className="anchor px-2" onClick={() => changeAppointmentStatus(record, "approved")}>Approve</h1>
                        <h1 className="anchor" onClick={() => changeAppointmentStatus(record, "rejected")}>Reject</h1>
                    </div>
                    )}
                </div>
            )
        }
    ]

    useEffect(() => {
        getAppointmentsData()
        // eslint-disable-next-line
    }, [])

    return (
        <Layout>
            <h2 className="page-header">Appointments</h2>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    )
}

export default DoctorAppointments;