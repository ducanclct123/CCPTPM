import {
    ContactsTwoTone,
    DashboardOutlined,
    EnvironmentTwoTone,
    FolderOpenTwoTone,
    HddTwoTone,
    HomeOutlined,
    NotificationTwoTone,
    ShopTwoTone,
    ShoppingTwoTone
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Card,
    Col,
    Row,
    Spin,
    Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import dashBoardApi from "../../apis/dashBoardApi";
import "./dashBoard.css";
import assetManagementApi from '../../apis/assetManagementApi';


const DashBoard = () => {
    const [statisticList, setStatisticList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotalList] = useState();
    const [data, setData] = useState(null);


    useEffect(() => {
        (async () => {
            try {
                
                await assetManagementApi.listAssetManagement().then((res) => {
                    console.log(res);
                    setTotalList(res)
                    setLoading(false);
                });


                await dashBoardApi.getAssetStatistics().then((res) => {
                    console.log(res);
                    setStatisticList(res);
                    setData(res.data.data);
                    setLoading(false);
                });

            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={false}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <DashboardOutlined />
                                <span>DashBoard</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <Row gutter={12} style={{ marginTop: 20 }}>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.userCount}</div>
                                        <div className='title_total'>Số thành viên</div>
                                    </div>
                                    <div>
                                        <ContactsTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{total?.data?.length}</div>
                                        <div className='title_total'>Tổng sự kiện</div>
                                    </div>
                                    <div>
                                        <NotificationTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        
                        {/* <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.meetingParticipantsCount}</div>
                                        <div className='title_total'>Số người tham gia</div>
                                    </div>
                                    <div>
                                        <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col> */}
                    </Row>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default DashBoard;