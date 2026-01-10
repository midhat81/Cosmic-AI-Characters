import { useState, useEffect, useCallback } from 'react'

type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown'

interface MediaPermissionState {
  audio: PermissionStatus
  video: PermissionStatus
}

export function useMediaPermission() {
  const [permissions, setPermissions] = useState<MediaPermissionState>({
    audio: 'unknown',
    video: 'unknown',
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkPermissions = useCallback(async () => {
    setIsChecking(true)

    try {
      // Check if browser supports permissions API
      if (!navigator.permissions) {
        setPermissions({ audio: 'unknown', video: 'unknown' })
        setIsChecking(false)
        return
      }

      // Check microphone permission
      try {
        const audioPermission = await navigator.permissions.query({
          name: 'microphone' as PermissionName,
        })
        setPermissions((prev) => ({ ...prev, audio: audioPermission.state }))

        // Listen for permission changes
        audioPermission.addEventListener('change', () => {
          setPermissions((prev) => ({ ...prev, audio: audioPermission.state }))
        })
      } catch (err) {
        console.warn('Could not check microphone permission:', err)
      }

      // Check camera permission (if needed in future)
      try {
        const videoPermission = await navigator.permissions.query({
          name: 'camera' as PermissionName,
        })
        setPermissions((prev) => ({ ...prev, video: videoPermission.state }))

        videoPermission.addEventListener('change', () => {
          setPermissions((prev) => ({ ...prev, video: videoPermission.state }))
        })
      } catch (err) {
        console.warn('Could not check camera permission:', err)
      }
    } catch (error) {
      console.error('Error checking media permissions:', error)
    } finally {
      setIsChecking(false)
    }
  }, [])

  const requestAudioPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Stop the stream immediately
      stream.getTracks().forEach((track) => track.stop())

      setPermissions((prev) => ({ ...prev, audio: 'granted' }))
      return true
    } catch (error) {
      console.error('Error requesting audio permission:', error)
      setPermissions((prev) => ({ ...prev, audio: 'denied' }))
      return false
    }
  }, [])

  const requestVideoPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())

      setPermissions((prev) => ({ ...prev, video: 'granted' }))
      return true
    } catch (error) {
      console.error('Error requesting video permission:', error)
      setPermissions((prev) => ({ ...prev, video: 'denied' }))
      return false
    }
  }, [])

  useEffect(() => {
    checkPermissions()
  }, [checkPermissions])

  return {
    permissions,
    isChecking,
    requestAudioPermission,
    requestVideoPermission,
    recheckPermissions: checkPermissions,
  }
}