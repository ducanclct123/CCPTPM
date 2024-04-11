import Texty from "rc-texty";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import assetManagementApi from "../../apis/assetManagementApi";
import triangleTopRight from "../../assets/icon/Triangle-Top-Right.svg";
import "../Home/home.css";
import { BackTop, Spin } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useHistory } from "react-router-dom";
import newsApi from "../../apis/newsApi";

const CardComponent = ({ title, imageSrc }) => (
    <div className="card">
        <img className="card-image" src={imageSrc} alt={title} />
        <div className="card-overlay">
            <div className="card-title">{title}</div>
        </div>
    </div>
);

const NewsComponent = ({ id, title, image, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleHover = () => {
        setIsHovered(!isHovered);
    };

    return (
        <Link
            to={`/news/${id}`}
            className={`news-item${isHovered ? " hover" : ""}`}
        >
            <img className="news-image" src={image} alt={title} />
            <div
                className="news-details"
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
            >
                <h3 className="news-title">{title}</h3>
            </div>
        </Link>
    );
};

const Home = () => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);

    const history = useHistory();

    const handleReadMore = (id) => {
        console.log(id);
        history.push("product-detail/" + id);
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await assetManagementApi.listAssetManagement();
                const approvedEvents = response.data.filter(
                    (event) =>
                        event.approval == "approved" &&
                        event.status !== "Chưa sử dụng",
                );
                console.log(approvedEvents);
                setProductList(approvedEvents);
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event list:" + error);
            }

            try {
                const response = await newsApi.getListNews();
                setNews(response);
                console.log(response);
            } catch (error) {
                console.log("Failed to fetch event list:" + error);
            }
        })();
    }, []);

    const cardData = [
        {
            title: "HCM CITY EXPORT 2024",
            imageSrc:
                "https://firebasestorage.googleapis.com/v0/b/zalo-app-66612.appspot.com/o/1709140177388vietnam-ete-2024.jpg?alt=media&token=9b2d8bc9-814e-4505-a637-ecaf0e75ddf5",
        },
        {
            title: "Vietnam Int’l Café Show 2024",
            imageSrc:
                "https://firebasestorage.googleapis.com/v0/b/zalo-app-66612.appspot.com/o/1709140140998gaming-vietnam-2024.jpg?alt=media&token=42ba3892-ba7f-4998-8cf9-c7b899034459",
        },
        {
            title: "VIETOFFICE 2024 ",
            imageSrc:
                "https://firebasestorage.googleapis.com/v0/b/zalo-app-66612.appspot.com/o/1709140238266vietnam-expo-hcm-2023-dec.jpg?alt=media&token=544b0153-841b-4c1b-b43e-ac8aa5bd080f",
        },
        {
            title: "VIPREMIUM 2024",
            imageSrc:
                "https://hanoigrapevine.com/wp-content/uploads/2024/03/art-is-long-time-is-fleeting-326x235.jpg",
        },
        {
            title: "VIETBABY FAIR HCM 2024",
            imageSrc:
                "https://hanoigrapevine.com/wp-content/uploads/2024/03/Talkshow-Culture-and-Pattern-326x235.jpg",
        },
        {
            title: "VIETNAM DAIRY 2024",
            imageSrc:
                "https://hanoigrapevine.com/wp-content/uploads/2024/03/workshop-Comptoir-Du-Temps-326x235.jpg",
        },
        {
            title: "GAMING VIETNAM 2024",
            imageSrc:
                "https://hanoigrapevine.com/wp-content/uploads/2024/03/Heat-Exhibition-326x235.jpg",
        },
    ];

    return (
        <Spin spinning={false}>
            <div
                style={{
                    background: "#FFFFFF",
                    overflowX: "hidden",
                    overflowY: "hidden",
                    marginTop: -15,
                }}
                className="home"
            >
                <div>
                    <img
                        src="	https://images.tkbcdn.com/1/1560/600/Upload/eventcover/2024/03/01/9BCDBD.jpg"
                        className="promotion1"
                    ></img>
                </div>
                <div>
                    <div className="texty-demo">
                        <Texty>Khu Vực</Texty>
                    </div>
                    <div className="texty-title">
                        <p>
                            Các Sự Kiện
                            <strong style={{ color: "#3b1d82" }}>
                                {" "}
                                Đặc Sắc
                            </strong>
                        </p>
                    </div>
                    <div className="card-container">
                        {cardData.map((card, index) => (
                            <CardComponent
                                key={index}
                                title={card.title}
                                imageSrc={card.imageSrc}
                            />
                        ))}
                    </div>
                </div>

                <div className="image-one">
                    <div className="texty-demo">
                        <Texty>Sự Kiện Sắp Diễn Ra</Texty>
                    </div>
                    <div className="texty-title">
                        <p>
                            Tham Quan{" "}
                            <strong style={{ color: "#3b1d82" }}>Ngay</strong>
                        </p>
                    </div>

                    <div className="column-two">
                        <div className="list-products container" key="1">
                            {productList.map((item) => (
                                <div
                                    className="col-product"
                                    onClick={() => handleReadMore(item.id)}
                                    key={item.id}
                                >
                                    <div className="show-product">
                                        <div className="col-2-product">
                                            <div style={{ with: 500 }}>
                                                {item.image ? (
                                                    <img
                                                        className="image-product"
                                                        src={item.image}
                                                        alt={item.name}
                                                    />
                                                ) : (
                                                    <img
                                                        className="image-product"
                                                        src={require("../../assets/image/NoImageAvailable.jpg")}
                                                        alt="No Image Available"
                                                    />
                                                )}
                                            </div>
                                            <div className="wrapper-products">
                                                <Paragraph
                                                    className="title-product"
                                                    ellipsis={{ rows: 2 }}
                                                >
                                                    {item.name}
                                                </Paragraph>
                                                <div>{item.description}</div>
                                                <div className="price-amount">
                                                    <Paragraph className="price-product">
                                                        {item.category_name}
                                                    </Paragraph>
                                                </div>
                                                <button
                                                    className="order-button"
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        width: "120px",
                                                        border: "1px solid white",
                                                        outline: "none",
                                                    }}
                                                >
                                                    Đặt Ngay
                                                </button>
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
                                        <img
                                            src={triangleTopRight}
                                            alt="Discount Badge"
                                        />
                                    </Paragraph>
                                </div>
                            ))}
                        </div>
                        <div className="list-products container" key="1">
                            {productList.map((item) => (
                                <div
                                    className="col-product"
                                    onClick={() => handleReadMore(item.id)}
                                    key={item.id}
                                >
                                    <div className="show-product">
                                        <div className="col-2-product">
                                            <div style={{ with: 500 }}>
                                                {item.image ? (
                                                    <img
                                                        className="image-product"
                                                        src={item.image}
                                                        alt={item.name}
                                                    />
                                                ) : (
                                                    <img
                                                        className="image-product"
                                                        src={require("../../assets/image/NoImageAvailable.jpg")}
                                                        alt="No Image Available"
                                                    />
                                                )}
                                            </div>
                                            <div className="wrapper-products">
                                                <Paragraph
                                                    className="title-product"
                                                    ellipsis={{ rows: 2 }}
                                                >
                                                    {item.name}
                                                </Paragraph>
                                                <div>{item.description}</div>
                                                <div className="price-amount">
                                                    <Paragraph className="price-product">
                                                        {item.category_name}
                                                    </Paragraph>
                                                </div>
                                                <button
                                                    className="order-button"
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        width: "120px",
                                                        border: "1px solid white",
                                                        outline: "none",
                                                    }}
                                                >
                                                    Đặt Ngay
                                                </button>
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
                                        <img
                                            src={triangleTopRight}
                                            alt="Discount Badge"
                                        />
                                    </Paragraph>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="texty-demo">
                        <Texty>Tin tức</Texty>
                    </div>
                    <div className="texty-title">
                        <p>
                            Cập nhật{" "}
                            <strong style={{ color: "#3b1d82" }}>
                                Các Tin Tức Mới Nhất
                            </strong>
                        </p>
                    </div>
                    <div className="list-news-container">
                        {news.map((item, index) => (
                            <NewsComponent
                                key={index}
                                id={item.id}
                                title={item.name}
                                image={item.image}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <BackTop style={{ textAlign: "right" }} />
        </Spin>
    );
};

export default Home;
