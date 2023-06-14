import React from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
    return (
      <MDBFooter bgColor='secondary' className='text-center text-lg-start text-muted bg-opacity-25'>
  
        <MDBContainer className='text-center text-md-start mt-3 border-top' style={{ borderTopWidth: '5px' }}>
        <MDBRow className='mt-3'>
            {/* contact info */}
            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>

                {/* email */}
                <p>
                <MDBIcon icon="envelope" className="me-3" />
                etan.cohn@gmail.com
                </p>
                {/* phone */}
                <p>
                <MDBIcon icon="phone" className="me-3" /> (972) 310 6503
                </p>
            </MDBCol>

            {/* Social Media */}
            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>Social Media</h6>

                <div>
                    <p>
                        <a href='https://www.facebook.com/profile.php?id=100008408079481' className='me-4 text-reset'>
                        <MDBIcon fab icon="facebook-f me-3" />
                        Facebook
                        </a>
                    </p>

                    <p>
                        <a href='' className='me-4 text-reset'>
                        <MDBIcon fab icon="instagram me-3" />
                        Instagram
                        </a>
                    </p>

                    <p>
                        <a href='' className='me-4 text-reset'>
                        <MDBIcon fab icon="linkedin me-3" />
                        LinkedIn
                        </a>
                    </p>
    
                    
                </div>
                
            </MDBCol>    

        </MDBRow>
        </MDBContainer>
  
      </MDBFooter>
    );
}