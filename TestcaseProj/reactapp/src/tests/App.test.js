import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('renders_main_title', () => {
  render(<App />);
  expect(screen.getByText('Attendance System')).toBeInTheDocument();
});

test('renders_welcome_message', () => {
  render(<App />);
  expect(screen.getByText('Welcome to Attendance System')).toBeInTheDocument();
});

test('shows_empty_state_message', () => {
  render(<App />);
  expect(screen.getByText('No people added yet')).toBeInTheDocument();
});

test('renders_input_field', () => {
  render(<App />);
  expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
});

test('renders_add_button', () => {
  render(<App />);
  expect(screen.getByText('Add Person')).toBeInTheDocument();
});

test('can_add_person_via_button', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('Enter name');
  fireEvent.change(input, { target: { value: 'Test User' } });
  fireEvent.click(screen.getByText('Add Person'));
  expect(screen.getByText('Test User')).toBeInTheDocument();
});

test('can_add_person_via_enter_key', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('Enter name');
  fireEvent.change(input, { target: { value: 'Another User' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
  expect(screen.getByText('Another User')).toBeInTheDocument();
});

test('shows_present_and_absent_buttons_after_adding_person', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('Enter name');
  fireEvent.change(input, { target: { value: 'Test User' } });
  fireEvent.click(screen.getByText('Add Person'));
  expect(screen.getByText('Present')).toBeInTheDocument();
  expect(screen.getByText('Absent')).toBeInTheDocument();
});

test('can_mark_person_as_present', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('Enter name');
  fireEvent.change(input, { target: { value: 'Test User' } });
  fireEvent.click(screen.getByText('Add Person'));
  const presentButtons = screen.getAllByText('Present');
  fireEvent.click(presentButtons[0]);
  expect(screen.getByText('Test User')).toBeInTheDocument();
});

test('shows_statistics_after_adding_people', () => {
  render(<App />);
  expect(screen.getByText(/Total:/)).toBeInTheDocument();
  expect(screen.getByText(/Present:/)).toBeInTheDocument();
  expect(screen.getByText(/Absent:/)).toBeInTheDocument();
});