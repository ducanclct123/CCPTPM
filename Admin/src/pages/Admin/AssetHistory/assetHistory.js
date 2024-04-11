import { HomeOutlined, ShoppingOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import {
    BackTop,
    Breadcrumb,
    Col,
    Input,
    Row,
    Select,
    Spin,
    Table,
    Modal,
    Form,
    Button,
    notification,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import assetEventApi from "../../../apis/assetCategoryApi";
import "./assetHistory.css";
import assetManagementApi from "../../../apis/assetManagementApi";
import userApi from "../../../apis/userApi";
import { useHistory, useParams } from "react-router-dom";

const { Option } = Select;

const AssetHistory = () => {
    let { id } = useParams();

    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleFilter = async (name) => {
        try {
            const res = await assetEventApi.searchEvent(name);
            setCategory(res.data);
        } catch (error) {
            console.log("search to fetch category list:" + error);
        }
    };

    const columns = [
        {
            title: "ID",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Ảnh đại diện",
            key: "image",
            dataIndex: "image",
            render: (image) =>
                image ? (
                    <img
                        src={image}
                        alt="User Avatar"
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                    />
                ) : (
                    <span>Không có ảnh</span>
                ), // Display image or placeholder
        },
        {
            title: "Email",
            key: "email",
            dataIndex: "email",
        },
        {
            title: "Số điện thoại",
            key: "phone",
            dataIndex: "phone",
        },
        {
            title: "Tên đăng nhập",
            key: "username",
            dataIndex: "username",
        },
        {
            title: "Vai trò",
            key: "role",
            dataIndex: "role",
        },
        {
            title: "Ngày tạo",
            key: "created_at",
            dataIndex: "created_at",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "Ngày cập nhật",
            key: "updated_at",
            dataIndex: "updated_at",
            render: (text) => moment(text).format("YYYY-MM-DD"),
        },
        {
            title: "File nộp bài",
            key: "submission_file",
            dataIndex: "submission_file",
            render: (submissionFile) =>
                submissionFile ? (
                    <a
                        href={submissionFile}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Xem file
                    </a>
                ) : (
                    "Chưa có link"
                ),
        },

        {
            title: "Nhận xét",
            key: "submission_comment",
            dataIndex: "submission_comment",
            render: (submission_file, record) => (
                <span>
                    {record.submission_comment == null ? (
                        <Button
                            type="link"
                            onClick={() => showModal(record.user_id)}
                        >
                            Nhận xét
                        </Button>
                    ) : (
                        record.submission_comment
                    )}
                </span>
            ),
        },
    ];

    const handleSubmitComment = async () => {
        try {
            await assetManagementApi.submitSubmissionComment(
                id,
                bookId,
                comment,
            );
            await getListAgain(); // Gọi hàm getListAgain để cập nhật danh sách sau khi thêm nhận xét
            handleCancel(); // Đóng modal
            notification.success({
                message: "Thêm nhận xét thành công",
                duration: 2, // Độ dài của thông báo (tính theo giây)
            });
        } catch (error) {
            console.log("Failed to submit comment:", error);
            notification.error({
                message: "Thêm nhận xét thất bại",
                duration: 2, // Độ dài của thông báo (tính theo giây)
            });
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState("");
    const [userData, setUserData] = useState([]);
    const [bookId, setBookId] = useState([]);

    const showModal = (book) => {
        setModalVisible(true);
        setBookId(book);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const getListAgain = () => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const createdById = response.user.id;
                await assetManagementApi.listParticipants(id).then((res) => {
                    console.log(res);
                    setCategory(res.participants);
                    setLoading(false);
                });
            } catch (error) {
                console.log("Failed to fetch category list:" + error);
            }
        })();
    };

    useEffect(() => {
        getListAgain();
    }, []);
    return (
        <div>
            <Spin spinning={loading}>
                <div className="container">
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Danh sách người tham gia</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader subTitle="" style={{ fontSize: 14 }}>
                                <Row>
                                    <Col span="18"></Col>
                                    <Col span="6">
                                        <Row justify="end"></Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <Modal
                        title="Nhận xét"
                        visible={modalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                Hủy
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                onClick={handleSubmitComment}
                            >
                                Gửi nhận xét
                            </Button>,
                        ]}
                    >
                        <Form>
                            <Form.Item label="Nhận xét">
                                <Input.TextArea
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <div style={{ marginTop: 30 }}>
                        <Table
                            columns={columns}
                            pagination={{ position: ["bottomCenter"] }}
                            dataSource={category}
                        />
                    </div>
                </div>

                <BackTop style={{ textAlign: "right" }} />
            </Spin>
        </div>
    );
};

export default AssetHistory;
