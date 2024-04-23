import React from 'react'
import Jumbotron from '../components/cards/Jumbotron';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';

const Home = () =>{ 

    return( 
        <>
        <div className='mt-5 text-danger h1 font-weight-bold text-center'>
            <Jumbotron text={['Latest Products', 'New Arrivals', 'Best Sellers']}/>
        </div>

        <h4 className='text-center p-3 mt-5 mb-5 display-3 bg-dark text-white'>
            New Arrivals
        </h4>
        <NewArrivals/>
        <h4 className='text-center p-3 mt-5 mb-5 display-3 bg-dark text-white'>
            Best Sellers
        </h4>
        <BestSellers/>
        </>
    )
}

export default Home