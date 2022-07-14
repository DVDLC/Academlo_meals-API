const dinamicRate = ( arr = [] ) => {
    return arr.reduce( ( previous, review ) => previous + review.raiting, 0 )
}


module.exports = {
    dinamicRate
}