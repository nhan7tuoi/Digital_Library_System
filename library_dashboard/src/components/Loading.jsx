import { Spin } from "antd";

const Loading = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <Spin size="large">
              <p style={{marginTop:100,backgroundColor:'rgba(0, 0, 0, 0.65)',color:'white'}}>
                Đợi chút nhé... 
              </p>
            </Spin>
          </div>
    );
    }

    export default Loading;