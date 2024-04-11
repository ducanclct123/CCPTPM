import {
    Breadcrumb,
    Button,
    Card,
    Carousel,
    Col,
    Popconfirm,
    Rate,
    Row,
    Spin,
    message,
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import assetManagementApi from "../../../apis/assetManagementApi";
import userApi from "../../../apis/userApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import "./productDetail.css";

const ProductDetail = () => {
    const [productDetail, setProductDetail] = useState([]);
    const [recommend, setRecommend] = useState([]);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
    const history = useHistory();

    const [colorProduct, setColorProduct] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);

    const handleReadMore = (id) => {
        console.log(id);
        history.push("/product-detail/" + id);
        window.location.reload();
    };

    function handleClick(color) {
        // Xử lý logic khi click vào điểm màu
        console.log("Selected color:", color);
        setColorProduct(color);
        setSelectedColor(color);
    }

    const [avgRating, setAvgRating] = useState(null);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                await assetManagementApi
                    .getDetailAssetManagement(id)
                    .then((item) => {
                        setProductDetail(item.data);
                    });
                await assetManagementApi
                    .listAssetManagement(id)
                    .then((item) => {
                        setRecommend(item?.data);
                    });
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
        window.scrollTo(0, 0);
    });

    const handleRegisterAsset = async () => {
        // Prepare data for the API call (replace with your actual data structure)
        const data = {
            assetId: id,
            userId: userData.id,
        };

        try {
            const response = await assetManagementApi.registerAsset(data);
            console.log(response);
            if (response.message === "User already registered for this asset") {
                message.error("Bạn đã đăng ký sự kiện này!");
            } else {
                message.success("Lịch của bạn đã được đặt!");
            }
        } catch (error) {
            console.error("Error registering asset:", error);
            message.error("Đặt lịch thất bại!");
        }
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
                                <Breadcrumb.Item href="http://localhost:3500/product-list/643cd88879b4192efedda4e6">
                                    <span>Sản phẩm</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <span>{productDetail.name}</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <Row gutter={12} style={{ marginTop: 20 }}>
                            <Col span={8}>
                                {productDetail?.slide?.length > 0 ? (
                                    <Carousel
                                        autoplay
                                        className="carousel-image"
                                    >
                                        {productDetail.slide.map((item) => (
                                            <div className="img" key={item}>
                                                <img
                                                    style={{
                                                        width: "50%",
                                                        height: "50%",
                                                        marginLeft: "100px",
                                                    }}
                                                    src={item}
                                                    alt=""
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <Card
                                        className="card_image"
                                        bordered={false}
                                    >
                                        <img src={productDetail.image} />
                                        <div className="promotion"></div>
                                    </Card>
                                )}
                            </Col>
                            <Col span={16}>
                                <div className="price">
                                    <h1 className="product_name">
                                        {productDetail.name}
                                    </h1>
                                    <Rate
                                        disabled
                                        value={avgRating}
                                        className="rate"
                                    />
                                </div>
                                <Card
                                    className="card_total"
                                    bordered={false}
                                    style={{ width: "50%" }}
                                >
                                    <div className="price_product">
                                        {productDetail.category_name}
                                    </div>

                                    <div class="box-product-promotion">
                                        <div class="box-product-promotion-header">
                                            <p>Ưu đãi</p>
                                        </div>
                                        <div class="box-content-promotion">
                                            <p class="box-product-promotion-number"></p>
                                            <a>
                                                Hỗ trợ tận tình - Tư vấn tận tâm
                                                <br />
                                                <br /> Tặng thêm voucher cho lần
                                                tiếp theo <br />
                                                <br /> Hot cho khách hàng mới
                                            </a>
                                        </div>
                                    </div>

                                    <div className="color-product">
                                        {productDetail?.color?.map((color) => (
                                            <span
                                                key={color}
                                                style={{
                                                    backgroundColor: color,
                                                }} // Sửa đổi ở đây
                                                className={`dot ${
                                                    selectedColor === color
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleClick(color)
                                                }
                                            ></span>
                                        ))}
                                    </div>
                                    <div className="box_cart_1">
                                        <Popconfirm
                                            title="Xác nhận đặt lịch?"
                                            onConfirm={handleRegisterAsset}
                                            onCancel={() =>
                                                console.log("Booking cancelled")
                                            }
                                            okText="Xác nhận"
                                            cancelText="Huỷ"
                                        >
                                            <Button
                                                type="primary"
                                                className="by"
                                                size={"large"}
                                            >
                                                Đặt Lịch Ngay
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <div className="describe">
                            <div className="title_total">
                                Giới thiệu sự kiện "{productDetail.name}"
                            </div>
                            <div
                                className="describe_detail_description"
                                dangerouslySetInnerHTML={{
                                    __html: productDetail.description,
                                }}
                            ></div>
                        </div>

                        <Row gutter={12} style={{ marginTop: 20 }}>
                            <Col span={16}>
                                <Card className="card_total" bordered={false}>
                                    <div className="card_number"></div>
                                </Card>
                            </Col>
                        </Row>
                        <div></div>

                        <div className="price" style={{ marginTop: 40 }}>
                            <h1 className="product_name">
                                Sự kiện bạn có thể quan tâm
                            </h1>
                        </div>
                        <Row
                            style={{ marginTop: 40 }}
                            gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
                            className="row-product"
                        >
                            {recommend?.map((item) => (
                                <Col
                                    xl={{ span: 6 }}
                                    lg={{ span: 6 }}
                                    md={{ span: 12 }}
                                    sm={{ span: 12 }}
                                    xs={{ span: 24 }}
                                    className="col-product"
                                    onClick={() => handleReadMore(item.id)}
                                    key={item.id}
                                >
                                    <div className="show-product">
                                        {item.image ? (
                                            <img
                                                className="image-product"
                                                src={item.image}
                                            />
                                        ) : (
                                            <img
                                                className="image-product"
                                                src={require("../../../assets/image/NoImageAvailable.jpg")}
                                            />
                                        )}
                                        <div className="wrapper-products">
                                            <Paragraph
                                                className="title-product"
                                                ellipsis={{ rows: 2 }}
                                            >
                                                {item.name}
                                            </Paragraph>
                                            <div className="price-amount">
                                                <Paragraph className="price-product">
                                                    {item.category_name}
                                                </Paragraph>
                                            </div>
                                        </div>
                                    </div>
                                    <Paragraph
                                        className="badge"
                                        style={{
                                            position: "absolute",
                                            top: 10,
                                            left: 9,
                                        }}
                                    >
                                        <span>Hot</span>
                                        <img src={triangleTopRight} />
                                    </Paragraph>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};

export default ProductDetail;
