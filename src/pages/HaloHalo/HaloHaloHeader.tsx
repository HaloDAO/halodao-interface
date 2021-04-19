import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader() {
  return (
    <StyledSwapHeader
    style={{
      background: "blue"
    }}
    >
      <RowBetween>
        <TYPE.black fontWeight={500}>HALO → HALOHALO</TYPE.black>
      </RowBetween>
    </StyledSwapHeader>
  )
}
