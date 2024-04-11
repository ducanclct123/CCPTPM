import React from "react";
import { Layout } from "antd";
import { Col, Row, Divider } from "antd";
import { SocialIcon } from "react-social-icons";
import "./footer.css";

const { Footer } = Layout;

function _Footer() {
    return (
        <Footer
            style={{ backgroundColor: "#F5F5F5", padding: 30, paddingTop: 80 }}
        >
            <Row className="footer-desktop">
                <Col span={5} className="footer">
                    <strong
                        style={{
                            color: "#00000",
                            fontSize: 20,
                            cursor: "pointer",
                        }}
                    >
                        Tổng đài hỗ trợ
                    </strong>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Gọi mua hàng 1800.2097
                    </p>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Gọi khiếu nại 1800.2063
                    </p>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Gọi bảo hành 1800.2064
                    </p>
                </Col>
                <Col span={5} className="footer">
                    <strong
                        style={{
                            color: "#00000",
                            fontSize: 20,
                            cursor: "pointer",
                        }}
                    >
                        Điều khoản
                    </strong>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Chính sách bảo mật
                    </p>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Quy định chung
                    </p>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Quy chế hoạt động
                    </p>
                </Col>
                <Col span={5} className="footer">
                    <strong
                        style={{
                            color: "#00000",
                            fontSize: 20,
                            cursor: "pointer",
                        }}
                    >
                        Danh mục
                    </strong>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Trang chủ
                    </p>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Giới thiệu
                    </p>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Tin tức
                    </p>
                    <p
                        style={{
                            marginTop: 20,
                            color: "#00000",
                            fontWeight: 400,
                            fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Sản phẩm
                    </p>
                </Col>

                <Col span={5}>
                    <strong
                        style={{
                            color: "#00000",
                            fontSize: 20,
                            marginBottom: 40,
                            cursor: "pointer",
                        }}
                    >
                        Kết nối với chúng tôi
                    </strong>
                    <Row style={{ marginTop: 15 }}>
                        <Col span={6}>
                            <SocialIcon
                                url="https://www.youtube.com/"
                                style={{
                                    height: 35,
                                    width: 35,
                                    cursor: "pointer",
                                }}
                            />
                        </Col>
                        <Col span={6}>
                            <SocialIcon
                                url="https://www.facebook.com"
                                style={{
                                    height: 35,
                                    width: 35,
                                    cursor: "pointer",
                                }}
                            />
                        </Col>
                        <Col span={6}>
                            <SocialIcon
                                url="https://www.instagram.com"
                                style={{
                                    height: 35,
                                    width: 35,
                                    cursor: "pointer",
                                }}
                            />
                        </Col>
                        <Col span={6}>
                            <SocialIcon
                                url="https://www.tiktok.com/"
                                style={{
                                    height: 35,
                                    width: 35,
                                    cursor: "pointer",
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div style={{ textAlign: "center" }}>
                <Divider style={{ padding: 0 }} />
                <p style={{ color: "#00000", fontSize: 13 }}>
                    Copyright@ 2023 Created by Submission Management System
                </p>
                <p style={{ color: "#00000", fontSize: 13 }}>
                    Điện thoại: (+84) 369564384 - (+84) 369563284
                </p>
            </div>
        </Footer>
    );
}

export default _Footer;
