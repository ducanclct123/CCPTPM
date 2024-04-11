import { Breadcrumb, Button, Card, Col, Form, List, Row, Spin } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import productApi from "../../../apis/productApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import "./productList.css";
import assetManagementApi from "../../../apis/assetManagementApi";

const ProductList = () => {
    const [productDetail, setProductDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartLength, setCartLength] = useState();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);

    let { id } = useParams();
    const history = useHistory();
    const match = useRouteMatch();

    const handleReadMore = (id) => {
        console.log(id);
        history.push("/product-detail/" + id);
        window.location.reload();
    };

    const handleCategoryDetails = (id) => {
        const newPath = match.url.replace(/\/[^/]+$/, `/${id}`);
        history.push(newPath);
        window.location.reload();
    };

    const handleSearchPrice = async (minPrice, maxPrice) => {
        try {
            const dataForm = {
                page: 1,
                limit: 50,
                minPrice: minPrice,
                maxPrice: maxPrice,
            };
            await axiosClient
                .post("/product/searchByPrice", dataForm)
                .then((response) => {
                    if (response === undefined) {
                        setLoading(false);
                    } else {
                        setProductDetail(response.data.docs);
                        setLoading(false);
                    }
                });
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await productApi.getCategory();
                setCategories(response.data);

                await assetManagementApi
                    .getAssetsByCategoryId(id)
                    .then((item) => {
                        setProductDetail(item.data);
                        setCartLength(item?.length);
                    });

                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
        window.scrollTo(0, 0);
    }, [cartLength]);

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
                                    <span>Sự kiện</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <div className="container box">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() =>
                                        handleCategoryDetails(category.id)
                                    }
                                    className="menu-item-1"
                                >
                                    <div className="menu-category-1">
                                        {category.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div
                            className="list-products container"
                            key="1"
                            style={{ marginTop: 0, marginBottom: 50 }}
                        >
                            <Row>
                                <Col span={12}>
                                    <div className="title-category">
                                        <div class="title">
                                            <h3 style={{ paddingTop: "30px" }}>
                                                DANH SÁCH SỰ KIỆN
                                            </h3>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}></Col>
                            </Row>
                            <Row
                                gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
                                className="row-product-details"
                            >
                                <List
                                    grid={{
                                        gutter: 16,
                                        column:
                                            productDetail?.length >= 4
                                                ? 4
                                                : productDetail?.length,
                                    }}
                                    size="large"
                                    className="product-list"
                                    pagination={{
                                        onChange: (page) => {
                                            window.scrollTo(0, 0);
                                        },
                                        pageSize: 12,
                                    }}
                                    dataSource={productDetail}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <div
                                                className="show-product"
                                                onClick={() =>
                                                    handleReadMore(item.id)
                                                }
                                            >
                                                {item.image ? (
                                                    <img
                                                        className="image-product-1"
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
                                        </List.Item>
                                    )}
                                ></List>
                            </Row>
                        </div>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};

export default ProductList;
