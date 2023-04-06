import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch(); 

    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get("/api/user/get-appointments-by-user-id", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                } 
            })
            dispatch(hideLoading())
            if (response.data.success) {
                const mappedAppointments = response.data.data.map(appointment => {
                    return {
                        ...appointment,
                        formattedDateTime: dayjs(`${appointment.date} ${appointment.time}`, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY HH:mm"),
                    };
                });
                console.log("Mapped Appointments:", mappedAppointments);
                setAppointments(mappedAppointments);
            }
        }
        catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    } 

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Doctor",
            dataIndex: "name",
            render: (text, record) => (
                <span className="normal-text">
                    {record.doctorInfo.firstName} {record.doctorInfo.lastName}
                </span>
            )
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            render: (text, record) => (
                <span className="normal-text">
                    {record.doctorInfo.phoneNumber}
                </span>
            )
        },
        {
            title: "Date & Time",
            dataIndex: "formattedDateTime",
            render: (text) => (
                <span className="normal-text">
                    {text}
                </span>)
        },
        {
            title: "Status",
            dataIndex: "status",
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

export default Appointments;