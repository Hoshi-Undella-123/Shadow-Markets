def enforce(order, portfolio_state, limits):
    # limits = {'max_exposure': 100000, 'max_loss': 5000, 'max_leverage': 10}
    if order['size'] * order['price'] > limits['max_exposure']:
        return False
    if portfolio_state['current_loss'] + order['size'] * (order['price'] - portfolio_state['avg_price']) > limits['max_loss']:
        return False
    if portfolio_state['leverage'] > limits['max_leverage']:
        return False
    return True
