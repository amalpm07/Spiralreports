.wpo-contact-info .info-icon {
    width: 90px;
    height: 90px;
    background: #fff;
    line-height: 90px;
    border-radius: 50%;
    -webkit-box-shadow: 0px 10px 40px 0px rgba(50, 50, 50, 0.1);
    -moz-box-shadow: 0px 10px 40px 0px rgba(50, 50, 50, 0.1);
    box-shadow: 0px 10px 40px 0px rgba(50, 50, 50, 0.1);
    text-align: center;
    margin-right: 20px;
    align-items: center;
    margin: auto;
    margin-bottom: 20px;
}

.info-item {
    -webkit-box-shadow: 0px 10px 40px 0px rgba(50, 50, 50, 0.1);
    -moz-box-shadow: 0px 10px 40px 0px rgba(50, 50, 50, 0.1);
    box-shadow: 0px 10px 40px 0px rgba(50, 50, 50, 0.1);
    padding: 33px 40px;
    margin-bottom: 30px;
    background: #fff;
    box-shadow: 0px 1px 18px 0px rgba(21, 44, 91, 0.1);
    border-radius: 5px;
}

.info-item h2 {
    font-size: 24px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 15px;
    color: #283a5e;

}

.info-icon .fi:before {
    font-size: 40px;
    color: #00d690;
}

.info-text span {
    color: #666666;
    font-size: 18px;
    font-weight: 300;
    margin-bottom: 10px;
    display: block;
}


@media(max-width: 590px) {
    .info-item h2 {
        font-size: 20px;
    }

    .info-text span {
        font-size: 15px;
    }

    .wpo-contact-info form textarea {
        height: 100px;
    }

    .info-item {
        padding: 32px 25px;
    }
}
.contact-area form,
.contact-area-s2 form {
    overflow: hidden;
    margin: 0 -15px;
}

.contact-area form .half-col,
.contact-area-s2 form .half-col {
    width: 50%;
    float: left;
}

@media (max-width: 600px) {

    .contact-area form .half-col,
    .contact-area-s2 form .half-col {
        width: 100%;
        float: left;
    }
}

.contact-area form .form-field,
.contact-area-s2 form .form-field {
   margin-bottom: 30px;
}


.contact-area form .submit-btn-wrapper,
.contact-area-s2 form .submit-btn-wrapper {
    padding-bottom: 0;
}

.contact-area form input,
.contact-area-s2 form input,
.contact-area form textarea,
.contact-area-s2 form textarea,
.contact-area-s2 form select {
    background:transparent;
    height: 50px;
    padding: 6px 15px;
     border-radius: 5px;
    -webkit-box-shadow: none;
    box-shadow: none;
    border:none;
    border:1px solid #e1e1e1;
    width: 100%;
    font-style: normal;
}

.contact-area select.form-control:not([size]):not([multiple]) {
    height: 50px;
    padding: 6px 15px;
    color: #bbb5a5;
    border:none;
    border-radius: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
    position: relative;
    -webkit-appearance:none;   
    -ms-appearance:none;      
    -o-appearance:none;                 
    appearance:none;
    -moz-appearance: none;
}

.contact-area form input:focus,
.contact-area-s2 form input:focus,
.contact-area form textarea:focus,
.contact-area-s2 form textarea:focus {
    -webkit-box-shadow: none;
    box-shadow: none;
    background:transparent;
    border:1px solid #e1e1e1;
}


.contact-area form textarea,
.contact-area-s2 form textarea {
    height: 150px;
    padding: 15px;
}
.contact-area .submit-btn-wrapper{
  text-align: center;
  margin-top: 30px;
}

.theme-btn-s3 {
    border-radius: 0;
    text-transform: uppercase;
}

.contact-area form .form-field p, 
.contact-area-s2 form .form-field p{
    color: red;
    font-size: 0.875rem;
    font-weight: normal;
    margin: 5px 0 0 0;
    text-align: left;
    display: block;
}

.contact-form ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color:#777;
    font-size: 14px;
    font-style: normal;
}

.contact-form ::-moz-placeholder {
    /* Firefox 19+ */

    color:#777;
    font-size: 14px;
    font-style: normal;
}

.contact-form :-ms-input-placeholder {
    /* IE 10+ */
    color:#777;
    font-size: 14px;
    font-style: normal;
}

.contact-form :-moz-placeholder {
    /* Firefox 18- */

    color:#777;
    font-size: 14px;
    font-style: normal;
}
.contact-content h2{
   font-size: 40px;
  font-weight: 700;
  color: #283a5e;
  margin-bottom: 50px;
  text-align: center;
}
.contact-content span{
  color: #00d690;
}
.contact-text h2 span{
  color: #00d690;
}
.contact-content .theme-btn{
    color: #fff;
    background: #00d690;
    transition: all .5s;
}
.contact-content .theme-btn:focus{
    outline: none;
}
.contact-content .theme-btn:hover{
    color: #fff;
    background: #00d690;
}

.contact-map {
  padding: 30px;
    margin-top: 80px;
    max-width: 100%;
    height: 455px;
    box-shadow: 0px 1px 18px 0px rgba(21, 44, 91, 0.1);
}

@media (max-width: 767px) {
   .contact-map {
        height: 350px;
  }

}
