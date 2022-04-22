import axios from 'axios';
import { useEffect, useState, useReducer } from 'react';
import { Badge, Button, Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import logger from 'use-reducer-logger';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(logger(reducer), {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  return loading ? (
    loading ? (
      <LoadingBox/>
    ) : error ? (
      <MessageBox variant='danger'>{error}</MessageBox>
    ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className='img-large'
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
                <Helmet>
                    <title>{product.name}</title>
                </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price: $ {product.price}</ListGroup.Item>
            <ListGroup.Item>
                Description: <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
            <Card>
                <Card.Body>
                    <ListGroup variant="flush"></ListGroup>
                    <ListGroup.Item>
                        <Row>
                            <Col>Price:</Col>
                            <Col>${product.price}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Status:</Col>
                            <Col>{product.countInStock>0?<Badge bg="success">In Stock</Badge>:
                            <Badge bg="danger">Out Of Stock</Badge>}</Col>
                        </Row>
                    </ListGroup.Item>

                    {product.countInStock > 0 && (
                        <ListGroupItem>
                            <div className='d-grid'>
                                <Button id="add-to-cart" variant='primary'>Add to cart</Button>
                            </div>
                        </ListGroupItem>
                    )}
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
