import React from 'react';
const ErrorBox = (code) => {
  return <div>"API response error {JSON.stringify(code)}: please try again later"</div>
}
export default ErrorBox;
