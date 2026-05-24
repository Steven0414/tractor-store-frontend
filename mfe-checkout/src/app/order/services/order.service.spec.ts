import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { OrderService } from './order.service';
import { PlaceOrderRequest } from '../models/order.models';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockRequest: PlaceOrderRequest = {
    firstName: 'John', lastName: 'Doe', email: 'john@example.com',
    phone: '1234567', address: '123 Main St', city: 'City',
    postalCode: '12345', paymentMethod: 'credit_card', items: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('placeOrder() should POST /api/orders', () => {
    const mockResponse = { orderId: 'ORD-1', status: 'confirmed', total: 100 };
    service.placeOrder(mockRequest).subscribe(res => expect(res).toEqual(mockResponse));
    const req = httpMock.expectOne('/api/orders');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('placeOrder() should map plain HTTP error to ProblemDetail', () => {
    service.placeOrder(mockRequest).subscribe({
      error: err => expect(err.title).toBe('Error inesperado'),
    });
    const req = httpMock.expectOne('/api/orders');
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('placeOrder() should use existing ProblemDetail from error body', () => {
    const problemDetail = { title: 'Bad Request', detail: 'Invalid input', status: 400 };
    service.placeOrder(mockRequest).subscribe({
      error: err => expect(err.title).toBe('Bad Request'),
    });
    const req = httpMock.expectOne('/api/orders');
    req.flush(problemDetail, { status: 400, statusText: 'Bad Request' });
  });
});
