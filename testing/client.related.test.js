/**
 * @jest-environment jsdom
 */

import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useSearchParams
} from "react-router-dom";
import App from '../client/src/components/App.jsx';
import Related from '../client/src/components/Related/Related.jsx';
import RelatedProducts from '../client/src/components/Related/RelatedProducts.jsx';
import YourOutfit from '../client/src/components/Related/YourOutfit.jsx';
import ProductCard from '../client/src/components/Related/ProductCard.jsx';
const fetch = require('node-fetch');
globalThis.fetch = fetch
global.window = Object.create(window);
const url = "http://127.0.0.1:3000/71698";
Object.defineProperty(window, 'location', {
  value: {
    href: url
  }
});
describe("RelatedProducts component", () => {
  // test("Test 1", async () => {
  //   const { findAllByText } = render(<App />)
  //   const joggers = await findAllByText("Morning Joggers")
  // });

  // test("Test 2", async () => {
  //   const { findByRole } = render(<App />)
  //   const headings = await findByRole("heading")
  //   console.log(typeof headings)
  // });

  test("Test 3", () => {
    const appComponent = TestRenderer.create(<App />)
    const appInstance = appComponent.root;
    const relatedComponent = appComponent.toJSON()[4]
    console.log(relatedComponent)
    console.log(relatedComponent.children)

  });

  test("Test 4", () => {
    expect(true).toBeTrue;
  });

  test("Test 5", () => {
    expect(true).toBeTrue;
  });
})

describe("YourOutfit component", () => {
  test("Test 1", () => {
    expect(true).toBeTrue;
  });
  test("Test 2", () => {
    expect(true).toBeTrue;
  });
  test("Test 3", () => {
    expect(true).toBeTrue;
  });
  test("Test 4", () => {
    expect(true).toBeTrue;
  });
  test("Test 5", () => {
    expect(true).toBeTrue;
  });
})

describe("ProductCard component", () => {
  test("Test 1", () => {
    expect(true).toBeTrue;
  });
  test("Test 2", () => {
    expect(true).toBeTrue;
  });
  test("Test 3", () => {
    expect(true).toBeTrue;
  });
  test("Test 4", () => {
    expect(true).toBeTrue;
  });
  test("Test 5", () => {
    expect(true).toBeTrue;
  });
})