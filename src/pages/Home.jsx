import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import StayList from '../components/StayList';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <SearchBar />
      <div className="home-content">
        <Filters />
        <StayList />
      </div>
    </div>
  );
};

export default Home;
