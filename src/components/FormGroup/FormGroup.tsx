import React, { ComponentProps, HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { StatusLabel } from '../StatusLabel'
import { Heading, HeadingTypes } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'

type innerMarginType = 'XXS' | 'XS' | 'S'
type Props = {
  title: string
  titleType?: HeadingTypes
  htmlFor?: string
  labelId?: string
  innerMargin?: innerMarginType
  statusLabelProps?: Array<ComponentProps<typeof StatusLabel>>
  helpMessage?: ReactNode
  errorMessages?: string | string[]
  disabled?: boolean
  className?: string
  children: ReactNode
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'aria-labelledby'>

export const FormGroup: VFC<Props & ElementProps> = ({
  title,
  titleType,
  htmlFor,
  labelId,
  innerMargin = 'XS',
  statusLabelProps = [],
  helpMessage,
  errorMessages,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  const disabledClass = disabled ? 'disabled' : ''
  const managedLabelId = useId(labelId)
  const isRoleGroup = props.role === 'group'

  return (
    <Wrapper
      {...props}
      className={`${className} ${disabledClass}`}
      themes={theme}
      aria-labelledby={isRoleGroup ? managedLabelId : undefined}
    >
      <TitleWrapper>
        <label htmlFor={htmlFor} id={managedLabelId}>
          <Title tag="span" type={titleType} themes={theme} className={disabledClass}>
            {title}
          </Title>
        </label>
        {statusLabelProps.length > 0 && (
          <StatusLabels themes={theme}>
            {statusLabelProps.map((statusLabelProp, index) => (
              <StyledStatusLabel {...statusLabelProp} key={index} themes={theme} />
            ))}
          </StatusLabels>
        )}
      </TitleWrapper>

      {helpMessage && <HelpMessage themes={theme}>{helpMessage}</HelpMessage>}

      {errorMessages &&
        (typeof errorMessages === 'string' ? [errorMessages] : errorMessages).map(
          (message, index) => (
            <ErrorMessage themes={theme} key={index}>
              <ErrorIcon
                color={disabled ? theme.color.TEXT_DISABLED : theme.color.DANGER}
                themes={theme}
              />
              <span>{message}</span>
            </ErrorMessage>
          ),
        )}
      <Body themes={theme} margin={innerMargin}>
        {children}
      </Body>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  &.disabled {
    color: ${({ themes }) => themes.color.TEXT_DISABLED};
  }
`

const TitleWrapper = styled.span`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
`

const Title = styled(Heading)<{ themes: Theme }>`
  &.disabled {
    color: ${({ themes }) => themes.color.TEXT_DISABLED};
  }
`

const StatusLabels = styled.span<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) =>
    css`
      margin-left: ${spacingByChar(0.5)};
      display: inline-block;
      line-height: 1;
    `}
`

const StyledStatusLabel = styled(StatusLabel)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) =>
    css`
      margin-right: ${spacingByChar(0.25)};
      display: inline-block;
    `}
`

const HelpMessage = styled.span<{ themes: Theme }>`
  ${({ themes: { fontSize, spacingByChar } }) =>
    css`
      display: block;
      margin-top: ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
    `}
`

const ErrorMessage = styled.span<{ themes: Theme }>`
  ${({ themes: { fontSize, spacingByChar } }) =>
    css`
      display: flex;
      align-items: center;
      margin-top: ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
      line-height: 1;
    `}
`

const ErrorIcon = styled(FaExclamationCircleIcon)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) =>
    css`
      margin-right: ${spacingByChar(0.25)};
    `}
`

const Body = styled.span<{ themes: Theme; margin: innerMarginType }>`
  ${({ themes: { spacing }, margin }) =>
    css`
      display: block;
      margin-top: ${spacing[margin]};
    `}
`
