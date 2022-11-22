import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Context from '../context/Context';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import CardRecipes from '../components/CardRecipes';
import Footer from './Footer';

function Recipes({ location: { pathname } }) {
  const { setResultsSearch, resultsSearch } = useContext(Context);
  const [initialReqCategory, setInitialReqCategory] = useState([]);
  const [test, setTest] = useState([]);

  const limitedIndex12 = 12;
  const limitedIndex5 = 5;
  const verifyRouteMeals = pathname === '/meals';

  const handleFilterClickDrinks = async ({ target }) => {
    setTest(target.innerHTML);
    const req = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${target.innerHTML}`);
    const resultsSearchArray = [];
    const data = await req.json();
    if (Object.keys(data).includes('drinks')) {
      data.drinks.forEach((element, index) => {
        if (index < limitedIndex12) { (resultsSearchArray.push(element)); }
      });
      setResultsSearch(resultsSearchArray);
    }
  };
  const handleFilterClickMeals = async ({ target }) => {
    setTest(target.innerHTML);
    const req = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${target.innerHTML}`);
    const data = await req.json();
    if (Object.keys(data).includes('meals')) {
      const resultsSearchArray = [];
      data.meals.forEach((element, index) => {
        if (index < limitedIndex12) { (resultsSearchArray.push(element)); }
      });
      setResultsSearch(resultsSearchArray);
    }
  };

  const fetchCategoriesMeals = async () => {
    const req = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const data = await req.json();
    setInitialReqCategory(data);
  };
  const fetchCategoriesDrinks = async () => {
    const req = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    const data = await req.json();
    setInitialReqCategory(data);
  };

  const allInitialRecipes = async () => {
    if (pathname === '/meals') {
      const req = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const data = await req.json();
      const resultsSearchArray = [];
      data.meals.forEach((element, index) => {
        if (index < limitedIndex12) {
          resultsSearchArray.push(element);
        }
        setResultsSearch(resultsSearchArray);
      });
    }
    if (pathname === '/drinks') {
      const req = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      const data = await req.json();
      const resultsSearchArray = [];
      data.drinks.forEach((element, index) => {
        if (index < limitedIndex12) (resultsSearchArray.push(element));
      });
      setResultsSearch(resultsSearchArray);
    }
  };

  const getCategories = async (event) => {
    const { target } = event;
    if (test === target.innerHTML) {
      allInitialRecipes();
      setTest('');
    }
  };

  useEffect(() => {
    if (pathname === '/meals') {
      allInitialRecipes();
      fetchCategoriesMeals();
    } else {
      allInitialRecipes();
      fetchCategoriesDrinks();
    }
  }, [verifyRouteMeals, pathname]);

  return (
    <div>
      <Header
        dataTestIdProfile="profile-top-btn"
        dataTestIdSearch="search-top-btn"
        title={ verifyRouteMeals ? 'Meals' : 'Drinks' }
        profileIcon={ profileIcon }
        searchIcon={ searchIcon }
        search
      />
      <button
        type="button"
        data-testid="All-category-filter"
        onClick={ () => {
          allInitialRecipes();
        } }
      >
        All
      </button>
      {
        Object.keys(initialReqCategory).includes('meals') && (
          initialReqCategory.meals.map((element, index) => (index < limitedIndex5 && (
            <button
              onClick={ (event) => {
                handleFilterClickMeals(event);
                getCategories(event);
              } }
              type="button"
              key={ `drinkCategoryKey${index}` }
              data-testid={ `${element.strCategory}-category-filter` }
            >
              {element.strCategory}
            </button>)))
        )
      }
      {
        Object.keys(initialReqCategory).includes('drinks') && !verifyRouteMeals && (
          initialReqCategory.drinks.map((element, index) => (index < limitedIndex5 && (
            <button
              onClick={ (event) => {
                handleFilterClickDrinks(event);
                getCategories(event);
              } }
              type="button"
              key={ `mealCategoryKey${index}` }
              data-testid={ `${element.strCategory}-category-filter` }
            >
              {element.strCategory}
            </button>)))
        )
      }
      {
        verifyRouteMeals && resultsSearch.length !== 0
          ? (
            resultsSearch?.map((e, index) => (
              <CardRecipes
                index={ index }
                e={ e }
                key={ `key${e.idMeal}` }
                test={ test }
              />
            ))
          )
          : (
            resultsSearch?.map((e, index) => (
              <CardRecipes
                index={ index }
                e={ e }
                data-testid={ `${index}-recipe-card` }
                key={ `key${e.idDrink}` }
              />
            ))
          )
      }

      <Footer />
    </div>
  );
}

Recipes.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
};

export default Recipes;
