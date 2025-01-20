import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import MainLayout from '../components/MainLayout';
import {
  customerThumb,
  grivImage,
  guardGroupImg,
  sahyogImage,
} from '../utils/images';
import { useEffect, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import { BiFemale, BiMale } from 'react-icons/bi';
import { userService } from '../../service/service';
import { Link } from 'react-router-dom';
export default function Home() {
  const [figureData, setFigureData] = useState([]);
  const [branches, setbranches] = useState([]);
  const [guardChartData, setGuardChartData] = useState([
    { asset: 'Active', amount: 0 },
    { asset: 'Inactive', amount: 0 },
  ]);
  const [customerChartData, setCustomerChartData] = useState([
    { asset: 'Active', amount: 0 },
    { asset: 'Inactive', amount: 0 },
  ]);

  useEffect(() => {
    const fetchFigureData = async () => {
      try {
        const response = await userService.get(
          '/api/v0/web/get_dashboard_figures'
        );
        if (response.data.valid) {
          const data = response.data.data[0];
          setFigureData(data);
          setGuardChartData([
            { asset: 'Active', amount: data.total_active_guards },
            { asset: 'Inactive', amount: data.total_non_active_guards },
          ]);
          setCustomerChartData([
            { asset: 'Active', amount: data.total_active_customers },
            { asset: 'Inactive', amount: data.total_non_active_customers },
          ]);
        }
      } catch (err) {
        console.error('Error fetching Figure data:', err);
      }
    };
    fetchFigureData();
  }, []);

  const [guardChartOption, setGuardChartOption] = useState({
    data: guardChartData,
    title: {
      text: 'Guards',
    },
    series: [
      {
        type: 'donut',
        calloutLabelKey: 'asset',
        angleKey: 'amount',
        innerRadiusRatio: 0.9,
        innerLabels: [
          {
            text: 'Total Investment',
            fontWeight: 'bold',
          },
          {
            text: '0',
            spacing: 0,
            // fontSize: 10,
            color: 'green',
          },
        ],
        innerCircle: {
          fill: '#c9fdc9',
        },
      },
    ],
  });

  const [customerChartOption, setCustomerChartOption] = useState({
    data: customerChartData,
    title: {
      text: 'Customers',
    },
    series: [
      {
        type: 'donut',
        calloutLabelKey: 'asset',
        angleKey: 'amount',
        innerRadiusRatio: 0.9,
        innerLabels: [
          {
            text: 'Total Customer',
            fontWeight: 'bold',
          },
          {
            text: '0',
            spacing: 0,
            // fontSize: 10,
            color: 'green',
          },
        ],
        innerCircle: {
          fill: '#c9fdc9',
        },
      },
    ],
  });

  useEffect(() => {
    const totalGuards = guardChartData.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    setGuardChartOption({
      ...guardChartOption,
      data: guardChartData,
      series: [
        {
          ...guardChartOption.series[0],
          innerLabels: [
            {
              text: 'Total guards',
              fontWeight: 'bold',
            },
            {
              text: `${totalGuards}`,
              spacing: 4,
              fontSize: 48,
              color: 'green',
            },
          ],
        },
      ],
    });
  }, [guardChartData]);

  useEffect(() => {
    const totalCustomers = customerChartData.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    setCustomerChartOption({
      ...customerChartOption,
      data: customerChartData,
      series: [
        {
          ...customerChartOption.series[0],
          innerLabels: [
            {
              text: 'Total Customer',
              fontWeight: 'bold',
            },
            {
              text: `${totalCustomers}`,
              spacing: 4,
              fontSize: 22,
              fontWeight: 'bold',
              color: 'green',
            },
          ],
        },
      ],
    });
  }, [customerChartData]);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await userService.get(
          '/api/v0/web/get_branchwise_totals'
        );
        if (response.data.valid) {
          setbranches(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching Branch data:', err);
      }
    };
    fetchBranchData();
  }, []);
  return (
    <MainLayout pageName="Home" hasAddButton={false}>
      <Container fluid className="mb-5 homeguard">
        <Row>
          <Col className="mb-3">
            <Link to={'/users/branch-manager?type=User'}>
              <div className="bg-white p-3 rounded-3 h-100 text-center">
                <h3>{figureData.total_branches}</h3>
                <h6 className="m-0">Branches</h6>
              </div>
            </Link>
          </Col>
          <Col className="mb-3">
            <Link to={'/users/branch-manager?type=Manager'}>
              <div className="bg-white p-3 rounded-3 h-100 text-center">
                <h3>{figureData.total_branch_managers}</h3>
                <h6 className="m-0">Branch Managers</h6>
              </div>
            </Link>
          </Col>
          <Col className="mb-3">
            <Link to={`/users/ops-manager`}>
              <div className="bg-white p-3 rounded-3 h-100 text-center">
                <h3>{figureData.total_ops_managers}</h3>
                <h6 className="m-0">Ops Managers</h6>
              </div>
            </Link>
          </Col>
          <Col className="mb-3">
            <Link to={`/users/area-manager`}>
              <div className="bg-white p-3 rounded-3 h-100 text-center">
                <h3>{figureData.total_area_managers}</h3>
                <h6 className="m-0">Area Managers</h6>
              </div>
            </Link>
          </Col>
          <Col xs={2} className="mb-3">
            <Table bordered className="m-0 h-100 sostable">
              <tbody>
                <tr>
                  <td className="bg-danger text-white">SOS</td>
                  <td className="bg-danger text-white">Read</td>
                  <td className="bg-danger text-white">Unread</td>
                </tr>
                <tr>
                  <td className="bg-pink">{figureData.total_sos}</td>
                  <td className="bg-pink">{figureData.sos_read}</td>
                  <td className="bg-pink">
                    <strong>{figureData.sos_unread}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col xs={7} className="mb-3">
            <Row>
              <Col xs={12}>
                <div
                  className="bg-white rounded-3 overflow-hidden p-2"
                  style={{ minHeight: '360px' }}
                >
                  <Row className="align-items-stretch">
                    <Col>
                      <img src={guardGroupImg} className="w-100 group_image" />
                    </Col>
                    <Col xs={5} className="position-relative h-100">
                      <AgCharts
                        options={guardChartOption}
                        className="guard_graph"
                      />
                    </Col>
                    <Col xs={3}>
                      <Card className="mb-3 malebox">
                        <Card.Header> Male Guards</Card.Header>
                        <Card.Body>
                          <Card.Title>
                            <BiMale />
                            {figureData.total_male_guards}
                          </Card.Title>
                        </Card.Body>
                      </Card>
                      <Card className="femalebox">
                        <Card.Header> Female Guards</Card.Header>
                        <Card.Body>
                          <Card.Title>
                            <BiFemale />
                            {figureData.total_female_guards}
                          </Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={5} className="mb-3">
            <div className="bg-white rounded-3 overflow-hidden h-100 customerbox">
              <Row className="align-items-center">
                <Col xs={5} className="ps-5">
                  <img
                    src={customerThumb}
                    alt=""
                    className="w-100 border rounded-3"
                  />
                </Col>
                <Col xs={7}>
                  <AgCharts
                    options={customerChartOption}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={6} className="mb-3">
            <div className="bg-white p-3 rounded-3 h-100">
              <h4>Branch Directories</h4>
              <Table bordered className="m-0 mt-3" size="sm">
                <thead>
                  <tr>
                    <th className="bg-dark text-white">Branches</th>
                    <th className="bg-dark text-white">Managers</th>
                    <th className="bg-dark text-white">Ops</th>
                    <th className="bg-dark text-white">Area</th>
                    <th className="bg-dark text-white">Customer</th>
                    <th className="bg-dark text-white">Guards</th>
                  </tr>
                </thead>
                <tbody>
                  {branches?.map((item, index) => {
                    return (
                      <tr key={item.r_branch_id}>
                        <td>{item.branch_name}</td>
                        <td>{item.total_branch_managers}</td>
                        <td>{item.total_ops_managers}</td>
                        <td>{item.total_area_managers}</td>
                        <td>{item.total_customers}</td>
                        <td>{item.total_guards}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col xs={6}>
            <Row>
              <Col xs={12} className="mb-4">
                <Table bordered className="grivsahyogbox griv mb-0">
                  <tbody>
                    <tr>
                      <td rowSpan={2} className="title">
                        <img src={grivImage} alt="" />
                        <span className="fs-5 m-0">Grievances</span>
                      </td>
                      <th>Pending</th>
                      <th>In process</th>
                      <th>Completed</th>
                      <th>Total</th>
                    </tr>
                    <tr>
                      <td>{figureData.grievances_pending}</td>
                      <td>{figureData.grievances_in_process}</td>
                      <td>{figureData.grievances_complete}</td>
                      <td>{figureData.total_grievances}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col xs={12}>
                <Table bordered className="grivsahyogbox syg m-0">
                  <tbody>
                    <tr>
                      <td rowSpan={2} className="title">
                        <img src={sahyogImage} alt="" />
                        <span className="fs-5 m-0">Sahyog</span>
                      </td>
                      <th>Pending</th>
                      <th>In Process</th>
                      <th>Approved</th>
                      <th>Rejected</th>
                      <th>Total</th>
                    </tr>
                    <tr>
                      <td>{figureData.sahyog_pending}</td>
                      <td>{figureData.sahyog_in_process}</td>
                      <td>{figureData.sahyog_accepted}</td>
                      <td>{figureData.sahyog_rejected}</td>
                      <td>{figureData.total_sahyog}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}
