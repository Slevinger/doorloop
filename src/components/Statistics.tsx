import styled from 'styled-components';

const StyledContainer = styled.div`
    width: 50%;
    flex-direction: column;
    margin: 10px;
    display: flex;
    .stats{
        display:flex;
        padding: 10px;
        flex-direction: row;
        .value{
            text-align: right;
        }
        .key{
            flex:1
        }
        &:nth-child(even){
            background-color: aliceblue;
        }
    }
`;


export default ({ values, dictionary = {} }: { values: { [key: string]: number }, dictionary: { [key: string]: string } }) => {
    return <StyledContainer >{Object.keys(values).map(key => (
        <div className='stats' key={key}>
            <text className={'key'}>{`${dictionary[key] || key} : `}</text>
            <text className={'value'}>{`${values[key]}`}</text>
        </div>
    ))}
    </StyledContainer>
}
