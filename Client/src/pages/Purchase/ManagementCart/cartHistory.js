import {
    Breadcrumb,
    Card,
    Form,
    Modal,
    Spin,
    Table,
    Tag,
    notification,
    Button,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import assetManagementApi from "../../../apis/assetManagementApi";
import productApi from "../../../apis/productApi";
import userApi from "../../../apis/userApi";
import uploadFileApi from "../../../apis/uploadFileApi";

const CartHistory = () => {
    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [openModalCreate, setOpenModalCreate] = useState(false); // Thêm state để kiểm soát việc mở modal

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: "10%",
        },
        {
            title: "Tên sự kiện",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Địa chỉ",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Trạng thái",
            key: "status",
            dataIndex: "status",
            render: (slugs) => (
                <span>
                    {slugs === "Đang sử dụng" ? (
                        <Tag
                            style={{ width: 95, textAlign: "center" }}
                            color="green"
                        >
                            Đang diễn ra
                        </Tag>
                    ) : slugs === "Đã xong" ? (
                        <Tag
                            color="gray"
                            style={{ width: 95, textAlign: "center" }}
                        >
                            Đã tổ chức
                        </Tag>
                    ) : slugs === "Hủy bỏ" ? (
                        <Tag
                            color="red"
                            style={{ width: 95, textAlign: "center" }}
                        >
                            Hủy bỏ
                        </Tag>
                    ) : (
                        <Tag
                            color="blue"
                            style={{ width: 95, textAlign: "center" }}
                        >
                            Đợi xác nhận
                        </Tag>
                    )}
                </span>
            ),
        },
        {
            title: "Ngày đăng ký tham gia",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => (
                <span>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</span>
            ),
        },
        {
            title: "Trạng thái nhận xét",
            key: "comment_status",
            render: (text, record) =>
                record.submission_comment ? (
                    <span>{record.submission_comment}</span>
                ) : (
                    <span>Chưa có nhận xét</span>
                ),
        },

        {
            title: "Nộp bài",
            key: "submit",
            render: (text, record) =>
                record.submission_file ? (
                    <Button type="primary" disabled>
                        Đã nộp
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        onClick={() => handleSubmit(record.asset_id)}
                    >
                        Nộp bài
                    </Button>
                ),
        },
    ];

    const handleCategoryList = () => {
        (async () => {
            try {
                const current = JSON.parse(localStorage.getItem("user"));
                await productApi
                    .getOrderByUser(current.user.id)
                    .then((item) => {
                        console.log(item[0]);
                        setOrderList(item[0]);
                    });
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
    };
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                await assetManagementApi
                    .listUserEvents(response.user.id)
                    .then((item) => {
                        setOrderList(item.userAssets);
                    });
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
        window.scrollTo(0, 0);
    }, []);

    const [bookId, setBookId] = useState();

    const handleSubmit = (id) => {
        setOpenModalCreate(true);
        setBookId(id);
    };

    const handleCancelModalCreate = () => {
        setOpenModalCreate(false);
    };

    const handleCreateEvent = async () => {
        setLoading(true);
        try {
            console.log(bookId, userData?.id, file);

            return assetManagementApi
                .uploadSubmissionFile(bookId, userData?.id, file)
                .then((response) => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description: "Nộp bài thất bại",
                        });
                    } else {
                        notification["success"]({
                            message: `Thông báo`,
                            description: "Nộp bài thành công",
                        });
                        handleCancelModalCreate(false);
                    }
                });
        } catch (error) {
            throw error;
        }
    };

    const [file, setUploadFile] = useState();

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    };

    return (
        <div>
            <Spin spinning={false}>
                <Card className="container_details">
                    <div className="product_detail">
                        <div
                            style={{
                                marginLeft: 5,
                                marginBottom: 10,
                                marginTop: 10,
                            }}
                        >
                            <Breadcrumb>
                                <Breadcrumb.Item href="http://localhost:3500/home">
                                    <span>Trang chủ</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <span>Lịch sử tham dự </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <div className="container" style={{ marginBottom: 30 }}>
                            <Modal
                                title="Nộp bài"
                                visible={openModalCreate}
                                onOk={handleCreateEvent}
                                onCancel={handleCancelModalCreate}
                                okText="Hoàn thành"
                                cancelText="Hủy"
                                width={600}
                            >
                                <Form
                                    form={form}
                                    name="eventCreate"
                                    layout="vertical"
                                    initialValues={{
                                        residence: [
                                            "zhejiang",
                                            "hangzhou",
                                            "xihu",
                                        ],
                                        prefix: "86",
                                    }}
                                    scrollToFirstError
                                >
                                    <Form.Item
                                        name="image"
                                        label="Chọn file"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng chọn file!",
                                            },
                                        ]}
                                    >
                                        <input
                                            type="file"
                                            onChange={handleChangeImage}
                                            id="avatar"
                                            name="file"
                                        />
                                    </Form.Item>
                                </Form>
                            </Modal>
                            <br></br>
                            <Card>
                                <Table
                                    columns={columns}
                                    dataSource={orderList}
                                    rowKey="_id"
                                    pagination={{ position: ["bottomCenter"] }}
                                />
                            </Card>
                        </div>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};

export default CartHistory;
