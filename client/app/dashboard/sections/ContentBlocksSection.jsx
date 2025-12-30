'use client'

import React, { useEffect, useState } from 'react'
import { contentAPI } from '@/app/lib/api'

const blockKeys = [
  { key: 'header_slides', label: 'Header Slides', isArray: true },
  { key: 'about', label: 'About Section', isArray: false },
  { key: 'footer', label: 'Footer Section', isArray: false },
]

export default function ContentBlocksSection() {
  const [blocks, setBlocks] = useState({})
  const [editingKey, setEditingKey] = useState(null)
  const [files, setFiles] = useState([])
  const [form, setForm] = useState({ title: '', content: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBlocks()
  }, [])

  async function loadBlocks() {
    try {
      const res = await contentAPI.getAll()
      console.log('✅ Loaded blocks:', res)
      const byKey = {}
      res.content_blocks?.forEach(b => (byKey[b.key] = b))
      setBlocks(byKey)
    } catch (err) {
      console.error('❌ Load blocks error:', err)
      setMessage('Failed to load content blocks')
    }
  }

  function startEdit(key) {
    const block = blocks[key]
    const blockDef = blockKeys.find(bk => bk.key === key)
    
    setEditingKey(key)
    setForm({
      title: block?.title || '',
      content: blockDef?.isArray ? block?.content || '[]' : block?.content || '',
    })
    setFiles([])
    setMessage('')
  }

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files)
    console.log('📁 Files selected:', selectedFiles.length)
    setFiles(selectedFiles)
  }

  async function saveBlock() {
    console.log('🚀 Starting save...')
    console.log('Editing key:', editingKey)
    console.log('Form data:', form)
    console.log('Files:', files.length)
    
    setLoading(true)
    setMessage('')

    try {
      const blockDef = blockKeys.find(bk => bk.key === editingKey)
      const block = blocks[editingKey]

      console.log('Block definition:', blockDef)
      console.log('Existing block:', block)

      // CASE 1: Header Slides - Multiple images
      if (blockDef?.isArray && editingKey === 'header_slides') {
        console.log('📸 Processing header slides...')
        
        if (!block) {
          // Create new header_slides block first
          console.log('Creating new header_slides block...')
          const fd = new FormData()
          fd.append('key', editingKey)
          fd.append('title', form.title)
          fd.append('content', '[]')
          
          console.log('FormData for create:', {
            key: editingKey,
            title: form.title,
            content: '[]'
          })
          
          const createRes = await contentAPI.createFormData(fd)
          console.log('✅ Create response:', createRes)
          
          await loadBlocks()
          
          // Now upload images one by one
          if (files.length > 0) {
            console.log('Uploading images...')
            await uploadHeaderSlideImages(createRes.content_block.id, [])
          }
        } else {
          // Update existing - upload new images
          console.log('Updating existing header_slides...')
          
          if (files.length > 0) {
            const existingUrls = JSON.parse(block.content || '[]')
            console.log('Existing URLs:', existingUrls)
            await uploadHeaderSlideImages(block.id, existingUrls)
          } else {
            // Just update title if no new images
            console.log('Updating title only...')
            await contentAPI.updateJSON(block.id, { title: form.title })
          }
        }
      } 
      // CASE 2: Other blocks - Single image + content
      else {
        console.log('📄 Processing regular block...')
        
        const fd = new FormData()
        fd.append('title', form.title)
        fd.append('content', form.content)

        console.log('FormData:', {
          title: form.title,
          content: form.content,
          hasFile: files.length > 0
        })

        if (files.length > 0) {
          fd.append('media_file', files[0])
          console.log('File attached:', files[0].name)
        }

        if (block) {
          // Update existing
          console.log('Updating block ID:', block.id)
          const result = await contentAPI.updateFormData(block.id, fd)
          console.log('✅ Update response:', result)
        } else {
          // Create new
          console.log('Creating new block...')
          fd.append('key', editingKey)
          const result = await contentAPI.createFormData(fd)
          console.log('✅ Create response:', result)
        }
      }

      setEditingKey(null)
      await loadBlocks()
      setMessage('✅ Saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('❌ Save error:', err)
      console.error('Error details:', err.message)
      setMessage(`❌ ${err.message || 'Save failed'}`)
    } finally {
      setLoading(false)
    }
  }

  async function uploadHeaderSlideImages(blockId, existingUrls) {
    console.log('📤 Uploading header slide images...')
    console.log('Block ID:', blockId)
    console.log('Existing URLs:', existingUrls)
    
    const newUrls = [...existingUrls]
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`Uploading file ${i + 1}/${files.length}:`, file.name)
      
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('content', JSON.stringify(newUrls))
      fd.append('media_file', file)

      const res = await contentAPI.updateFormData(blockId, fd)
      console.log('Upload response:', res)
      
      if (res?.content_block?.media_url) {
        newUrls.push(res.content_block.media_url)
        console.log('✅ Image URL added:', res.content_block.media_url)
      }
    }

    // Final update with all URLs
    console.log('Final update with URLs:', newUrls)
    await contentAPI.updateJSON(blockId, {
      title: form.title,
      content: JSON.stringify(newUrls)
    })
    console.log('✅ All images uploaded!')
  }

  async function deleteSlideImage(blockKey, urlToDelete) {
    if (!confirm('Delete this image?')) return

    try {
      setLoading(true)
      const block = blocks[blockKey]
      const urls = JSON.parse(block.content || '[]')
      const updated = urls.filter(url => url !== urlToDelete)

      console.log('Deleting image:', urlToDelete)
      console.log('Updated URLs:', updated)

      await contentAPI.updateJSON(block.id, {
        content: JSON.stringify(updated)
      })

      await loadBlocks()
      setMessage('✅ Image deleted')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('❌ Delete error:', err)
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function renderPreview(key) {
    const block = blocks[key]
    if (!block) return null

    const blockDef = blockKeys.find(bk => bk.key === key)

    if (blockDef?.isArray) {
      const urls = JSON.parse(block.content || '[]')
      return (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">
            Current Images ({urls.length}):
          </p>
          <div className="grid grid-cols-4 gap-2">
            {urls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={`http://localhost:4000${url}`}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  onClick={() => deleteSlideImage(key, url)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="mt-3 space-y-2">
        {block.media_url && (
          <div>
            <p className="text-sm text-gray-600">Current Image:</p>
            <img
              src={`http://localhost:4000${block.media_url}`}
              alt="Preview"
              className="w-48 h-32 object-cover rounded border"
            />
          </div>
        )}
        {block.content && (
          <div>
            <p className="text-sm text-gray-600">Content:</p>
            <p className="text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">{block.content}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">Content Blocks Management</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.startsWith('✅')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      {blockKeys.map(({ key, label, isArray }) => (
        <div key={key} className="border p-4 rounded mb-6 bg-white shadow">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold text-lg">{label}</h3>
            <button
              onClick={() => startEdit(key)}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {blocks[key] ? 'Edit' : 'Create'}
            </button>
          </div>

          {editingKey !== key && renderPreview(key)}

          {editingKey === key && (
            <form
              onSubmit={e => {
                e.preventDefault()
                saveBlock()
              }}
              className="space-y-4 mt-4 bg-gray-50 p-4 rounded"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArray ? 'Upload Images (multiple)' : 'Upload Image'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple={isArray}
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded"
                />
                {files.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {files.length} file(s) selected
                  </p>
                )}
              </div>

              {!isArray && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={4}
                    placeholder="Content"
                    value={form.content}
                    onChange={e =>
                      setForm({ ...form, content: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded font-medium ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingKey(null)}
                  disabled={loading}
                  className="px-6 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ))}
    </section>
  )
}