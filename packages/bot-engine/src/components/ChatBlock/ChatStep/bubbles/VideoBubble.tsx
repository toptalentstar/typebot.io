import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHostAvatars } from 'contexts/HostAvatarsContext'
import { useTypebot } from 'contexts/TypebotContext'
import {
  Table,
  Variable,
  VideoBubbleContent,
  VideoBubbleContentType,
  VideoBubbleStep,
} from 'models'
import { TypingContent } from './TypingContent'
import { parseVariables } from 'services/variable'

type Props = {
  step: VideoBubbleStep
  onTransitionEnd: () => void
}

export const showAnimationDuration = 400

export const mediaLoadingFallbackTimeout = 5000

export const VideoBubble = ({ step, onTransitionEnd }: Props) => {
  const { typebot } = useTypebot()
  const { updateLastAvatarOffset } = useHostAvatars()
  const messageContainer = useRef<HTMLDivElement | null>(null)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    showContentAfterMediaLoad()
  }, [])

  const showContentAfterMediaLoad = () => {
    setTimeout(() => {
      setIsTyping(false)
      onTypingEnd()
    }, 1000)
  }

  const onTypingEnd = () => {
    setIsTyping(false)
    setTimeout(() => {
      sendAvatarOffset()
      onTransitionEnd()
    }, showAnimationDuration)
  }

  const sendAvatarOffset = () => {
    if (!messageContainer.current) return
    const containerDimensions = messageContainer.current.getBoundingClientRect()
    updateLastAvatarOffset(containerDimensions.top + containerDimensions.height)
  }

  return (
    <div className="flex flex-col" ref={messageContainer}>
      <div className="flex mb-2 w-full lg:w-11/12 items-center">
        <div className={'flex relative z-10 items-start typebot-host-bubble'}>
          <div
            className="flex items-center absolute px-4 py-2 rounded-lg bubble-typing z-10 "
            style={{
              width: isTyping ? '4rem' : '100%',
              height: isTyping ? '2rem' : '100%',
            }}
          >
            {isTyping ? <TypingContent /> : <></>}
          </div>
          <VideoContent
            content={step.content}
            isTyping={isTyping}
            variables={typebot.variables}
          />
        </div>
      </div>
    </div>
  )
}

const VideoContent = ({
  content,
  isTyping,
  variables,
}: {
  content?: VideoBubbleContent
  isTyping: boolean
  variables: Table<Variable>
}) => {
  const url = useMemo(
    () => parseVariables({ text: content?.url, variables: variables }),
    [variables]
  )
  if (!content?.type) return <></>
  switch (content.type) {
    case VideoBubbleContentType.URL:
      const isSafariBrowser = window.navigator.vendor.match(/apple/i)
      return (
        <video
          controls
          className={
            'p-4 focus:outline-none w-full z-10 content-opacity rounded-md ' +
            (isTyping ? 'opacity-0' : 'opacity-100')
          }
          style={{
            height: isTyping ? '2rem' : 'auto',
            maxHeight: isSafariBrowser ? '40vh' : '',
          }}
          autoPlay
        >
          <source src={url} type="video/mp4" />
          Sorry, your browser doesn&apos;t support embedded videos.
        </video>
      )
    case VideoBubbleContentType.VIMEO:
    case VideoBubbleContentType.YOUTUBE: {
      const baseUrl =
        content.type === VideoBubbleContentType.VIMEO
          ? 'https://player.vimeo.com/video'
          : 'https://www.youtube.com/embed'
      return (
        <iframe
          src={`${baseUrl}/${content.id}`}
          className={
            'w-full p-4 content-opacity z-10 rounded-md ' +
            (isTyping ? 'opacity-0' : 'opacity-100')
          }
          height={isTyping ? '2rem' : '200px'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }
  }
}
