import createContainer from 'UTIL/createContainer'

const connectComponent = createContainer(
    ({ driverManage, router }) => ({driverManage, router}),
    require('ACTION/driverManage').default
);

export default {
    path: 'driver',

    indexRoute: { // 对应 /driver
        getComponent (nextState, cb) {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('COMPONENT/DriverManage/DriverManage').default))
            }, 'DriverManage')
        }
    },

    childRoutes: [
        { // 对应 /driver/add
            path: 'add',
            getComponent (nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, connectComponent(require('COMPONENT/DriverManage/DriverAdd').default))
                }, 'DriverAdd')
            }
        },
        { // 对应 /driver/detail
            path: 'detail',
            getComponent (nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, connectComponent(require('COMPONENT/DriverManage/DriverDetail').default))
                }, 'DriverDetail')
            }
        },
        { // 对应 /driver/update
            path: 'update/:driverName',
            getComponent (nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, connectComponent(require('COMPONENT/DriverManage/DriverUpdate').default))
                }, 'DriverDetail')
            }
        }
    ]
}
