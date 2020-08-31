import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import axios from 'axios';
jest.mock('axios')


import App2, {Item, List, SearchForm, InputWithLabel} from './App2';

test('renders learn react link', () => {
  const { getByText } = render(<App2 />);
  const linkElement = getByText(/My Hacker Stories/i);
  expect(linkElement).toBeInTheDocument();
});

describe('something truthy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });

  it('false to be false', () =>{
    expect(false).toBe(false);
  })
});

describe('Item', () =>{
  const item = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  };
  const handleRemoveItem = jest.fn();   //it's only testing what happens when the button is clicked,  to be continued
  let component;
  beforeEach(() => {
    component = renderer.create(
        <Item item={item} onRemoveItem={handleRemoveItem} />
    );
  });


  it('render all properties', ()=>{
    expect(component.root.findAllByType('span')[1].props.children).toEqual(  //the test is not good. Once the order of span in the element changes, test fails
        'Jordan Walke'
    );

    expect(component.root.findAllByProps({children: 'Jordan Walke'}).length).toEqual(1);


  });

  it('calls onRemoveItem on button click', () => {

    component.root.findByType('button').props.onClick();

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(item);

    expect(component.root.findAllByType(Item).length).toEqual(1);
  });

  test('renders snapshot', () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('List', () => {
  const list = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  const component = renderer.create(<List list={list} />);
  it('renders two items', () => {
    expect(component.root.findAllByType(Item).length).toEqual(2);
  });

  test('renders snapshot', () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  let component;

  beforeEach(() => {
    component = renderer.create(<SearchForm {...searchFormProps} />);
  });

  it('renders the input field with its value', () => {
    const value = component.root.findByType(InputWithLabel).props
        .value;

    expect(value).toEqual('React');
  });

  it('renders the input field with its value', () => {
    const value = component.root.findByType('input').props.value;

    expect(value).toEqual('React');
  });

  it('changes the input field', () => {
    const pseudoEvent = { target: 'Redux' };

    component.root.findByType('input').props.onChange(pseudoEvent);

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(
        pseudoEvent
    );
  });

  it('submits the form', () => {
    const pseudoEvent = {};

    component.root.findByType('form').props.onSubmit(pseudoEvent);

    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith(
        pseudoEvent
    );
  });

  test('renders snapshot', () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('App', () => {
  it('succeeds fetching data with a list', async () => {
    const list = [
      {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
      },
      {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
      },
    ];


    const promise = Promise.resolve({
      data: {
        hits: list,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    let component;
    await renderer.act(async () => {
      component = renderer.create(<App2 />);
    });

    expect(component.root.findByType(List).props.list).toEqual(list);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('fails fetching data with a list', async () => {
    const promise = Promise.reject();

    axios.get.mockImplementationOnce(() => promise);

    let component;

    await renderer.act(async () => {
      component = renderer.create(<App2 />);
    });

    expect(component.root.findByType('p').props.children).toEqual(
        'Something went wrong ...'
    );
    expect(component.toJSON()).toMatchSnapshot();

  });


});