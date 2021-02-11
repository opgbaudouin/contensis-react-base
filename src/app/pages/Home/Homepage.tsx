import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setRoute } from '%/routing/redux/actions';

type Props = {
  // eslint-disable-next-line no-undef
  entry: HomePageEntry;
};

const Homepage = ({ entry }: Props) => {
  const dispatch = useDispatch();

  const changeRoute = (path = '/zenInfo') => {
    dispatch(setRoute(path));
  };

  return (
    <>
      <h1>Hello world {entry && entry.entryTitle}</h1>
      <p>
        <Link to="/zenInfo">ZenInfo</Link>
      </p>
      <button onClick={() => changeRoute()}>Change Route</button>
      <button onClick={() => changeRoute('/account/login?redirect_uri=/')}>
        Go to Login
      </button>
      <button
        onClick={() =>
          changeRoute(
            '/account/registration?redirect_uri=/account/registration/success'
          )
        }
      >
        Go to Registration
      </button>
      <p>Entry pages (at contensis.zenhub)</p>
      <ul>
        <li>
          <Link to="/help-and-docs/apis/image-api/effects/blur">
            Gaussian blur (auth required by static route pattern match)
          </Link>
        </li>
        <li>
          <Link to="/terms-of-use">
            Terms of use (auth required by content type)
          </Link>
        </li>
      </ul>
      {/* <LoginButton text="Sign in here" /> */}
    </>
  );
};

Homepage.propTypes = {
  entry: PropTypes.object,
  setRoute: PropTypes.func,
};

export default Homepage;
