import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null) {
//option 
//null :아무나,
//true :로그인한 유저만 출입 가능
//false:로그인한 유저는 출입 불가능

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response);

                //로그인하지 않은 상태
                if(!response.payload.isAuth) {

                    //로그인한 유저만 출입가능한 페이지에 접근할 경우
                    if(option) {
                        props.history.push('login');
                    }
                } 

                //로그인한 상태
                else {
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/');
                    } else {
                        if(!option) {
                            props.history.push('/');
                        }
                    }
                }
            })
        }, [])

        return (
            <SpecificComponent />
        )
    }


    return AuthenticationCheck;
}