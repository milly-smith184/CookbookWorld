import React from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

function Footer() {
	return (
		<div className='footer-container'>
			<section className='footer-subscription'>
			<p className='footer-subscription-heading'>
				Join our newsletter for fresh recipes, tasty inspiration, 
				and new meal ideas delivered straight to your inbox.
			</p>
			<p className='footer-subscription-text'>
				You can unsubscribe at any time.
			</p>
			<div className='input-areas'>
				<form>
					<input type='email' name='email' placeholder='Your Email'
					className='footer-input'/>
					<Button buttonStyle='btn--outline'>Subscribe</Button>
				</form>
			</div>
			</section>
			  <div className='footer-links'>
	        <div className='footer-link-wrapper'>
	          <div className='footer-link-items'>
	            <h2>About Us</h2>
	            <Link to='/'>Contact</Link>
	            <Link to='/'>FAQs</Link>
	          </div>
	          <div className='footer-link-items'>
	            <h2>Product</h2> 
	            <Link to='../HowItWorks'>How it works</Link>
	          </div>
	        </div>
	        <div className='footer-link-wrapper'>
	          
	          <div className='footer-link-items'>
	            <h2>Social Media</h2>
	            <Link to='https://www.instagram.com/' target='_blank'>Instagram</Link>
	            <Link to='https://www.facebook.com/' target='_blank'>Facebook</Link>
	            <Link to='https://www.youtube.com/' target='_blank'>Youtube</Link>
	            <Link to='https://www.tiktok.com/' target='_blank'>Tik Tok</Link>
	          </div>
	        </div>
	      </div>
	      <section className='social-media'>
	      	<div className='social-media-wrap'>
	      	  <div className='footer-logo'> 
		      	     <Link 
		      	        to="/"
                        className="social-logo"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
		      	     >
		      			CBW    <img src="/cbw.svg" alt="CBW Logo" />
	      		     </Link>
	      	  </div>
	      	  <small className='website-rights'>CookbookWorld © 2026</small>
	      	  <div className='social-icons'> 
	      	  	<Link 
	      	  		className='social-icon-link facebook'
	      	  		to='https://www.facebook.com/'
	      	  		target='_blank'
	      	  		aria-label='Facebook'
	      	  	>
	      	  	  <i className='fa-brands fa-facebook-f' />
	      	  	</Link>
	      	  	<Link 
	      	  		className='social-icon-link instagram'
	      	  		to='https://www.instagram.com/'
	      	  		target='_blank'
	      	  		aria-label='Instagram'
	      	  	>
	      	  	 <i className="fa-brands fa-instagram" />

	      	  	</Link>
	      	  	<Link 
	      	  		className='social-icon-link tiktok'
	      	  		to='https://www.tiktok.com/'
	      	  		target='_blank'
	      	  		aria-label='TikTok'
	      	  	>
	      	  	  <i className='fa-brands fa-tiktok' />
	      	  	</Link>
	      	  	<Link 
	      	  		className='social-icon-link youtube'
	      	  		to='https://www.youtube.com/'
	      	  		target='_blank'
	      	  		aria-label='Youtube'
	      	  	>
	      	  	  <i className='fa-brands fa-youtube' />
	      	  	</Link>
	      	  </div>
	      	</div>
	      </section>
		</div>
	);
}

export default Footer;